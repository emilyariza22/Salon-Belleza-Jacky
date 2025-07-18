const pool = require('../db');

const getDeudaVitrinaPorCliente = async (clienteId) => {
  const result = await pool.query(`
    SELECT SUM(total) AS deuda_vitrina
    FROM venta_vitrina
    WHERE client_id = $1 AND estado_pago != 'pagado'
  `, [clienteId]);

  return result.rows[0]?.deuda_vitrina || 0;
};

module.exports = { getDeudaVitrinaPorCliente };
