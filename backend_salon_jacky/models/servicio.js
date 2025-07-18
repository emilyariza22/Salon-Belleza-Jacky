const pool = require('../db');

const getDeudaServiciosPorCliente = async (clienteId) => {
  const result = await pool.query(`
    SELECT SUM(costo_total) AS deuda_servicios
    FROM servicios
    WHERE client_id = $1 AND estado_pago != 'pagado'
  `, [clienteId]);

  return result.rows[0]?.deuda_servicios || 0;
};

module.exports = { getDeudaServiciosPorCliente };
