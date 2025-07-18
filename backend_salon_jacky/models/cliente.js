const pool = require('../db');

const getClienteById = async (clienteId) => {
  const result = await pool.query('SELECT * FROM clients WHERE id_client = $1', [clienteId]);
  return result.rows[0];
};

module.exports = { getClienteById };
