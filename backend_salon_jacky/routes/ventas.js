const express = require('express');
const router = express.Router();
const pool = require('../db');

// Registrar una venta de producto
router.post('/', async (req, res) => {
  const { producto, categoria, cantidad, valor_total, cliente, pago, deuda, imagen_url } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO ventas (producto, categoria, cantidad, valor_total, cliente, pago, deuda, imagen_url, fecha)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_DATE) RETURNING *`,
      [producto, categoria, cantidad, valor_total, cliente, pago, deuda, imagen_url]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al registrar la venta' });
  }
});

module.exports = router;
