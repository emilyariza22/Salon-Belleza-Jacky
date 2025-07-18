// routes/catalogo.js
const express = require('express');
const router = express.Router();
const pool = require('../db');

// Crear un ítem de catálogo (pedido de un cliente)
router.post('/:id/items', async (req, res) => {
  const catalogoId = req.params.id;
  const {
    producto_codigo,
    producto_nombre,
    cliente_nombre,
    precio,
    estado_pago // "pagado" o "pendiente"
  } = req.body;

  try {
    // Insertar en la tabla de ítems del catálogo
    const result = await pool.query(
      `INSERT INTO catalogo_items (catalogo_id, producto_codigo, producto_nombre, precio, cliente_nombre, estado_pago, creado_en)
       VALUES ($1, $2, $3, $4, $5, $6, CURRENT_DATE)
       RETURNING *`,
      [catalogoId, producto_codigo, producto_nombre, precio, cliente_nombre, estado_pago]
    );

    // Si el estado es "pendiente", registramos la deuda del cliente
    if (estado_pago === 'pendiente') {
      await pool.query(
        `INSERT INTO deudas_clientes (cliente_nombre, motivo, valor, creada_en)
         VALUES ($1, $2, $3, CURRENT_DATE)`,
        [cliente_nombre, `Pedido de catálogo: ${producto_nombre}`, precio]
      );
    }

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error al guardar el ítem:', error);
    res.status(500).json({ error: 'No se pudo guardar el ítem en el catálogo' });
  }
});

module.exports = router;
