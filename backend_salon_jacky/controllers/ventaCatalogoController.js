const pool = require('../db');

const crearVentaCatalogo = async (req, res) => {
  const { client_id, nombre_catalogo, campaña, producto, cantidad, precio_unitario, estado_pago } = req.body;

  const total = cantidad * precio_unitario;

  try {
    await pool.query(`
      INSERT INTO venta_catalogo (client_id, nombre_catalogo, campaña, producto, cantidad, precio_unitario, total, estado_pago)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `, [client_id, nombre_catalogo, campaña, producto, cantidad, precio_unitario, total, estado_pago]);

    res.status(201).json({ message: "Venta de catálogo registrada exitosamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al registrar la venta de catálogo" });
  }
};

module.exports = { crearVentaCatalogo };
 