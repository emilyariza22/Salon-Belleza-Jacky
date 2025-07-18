const pool = require('../db');

const getDeudaCatalogoPorCliente = async (clienteId) => {
  const result = await pool.query(`
    SELECT SUM(total) AS deuda_catalogo
    FROM venta_catalogo
    WHERE client_id = $1 AND estado_pago != 'pagado'
  `, [clienteId]);

  return result.rows[0]?.deuda_catalogo || 0;
};

module.exports = { getDeudaCatalogoPorCliente };
