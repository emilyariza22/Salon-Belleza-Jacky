// controllers/clientesController.js
const pool = require("../db");

// Obtener detalles de cliente + sus deudas organizadas
const getClienteDetalles = async (req, res) => {
  const { id } = req.params;

  try {
    // 1. Buscar datos del cliente
    const clienteResult = await pool.query("SELECT * FROM clientes WHERE id = $1", [id]);

    if (clienteResult.rows.length === 0) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }

    const cliente = clienteResult.rows[0];

    // 2. Buscar deudas de catálogo
    const catalogoResult = await pool.query(
      `SELECT producto, precio::numeric FROM ventas_catalogo WHERE cliente_id = $1 AND estado = 'pendiente'`,
      [id]
    );

    // 3. Buscar deudas de vitrina
    const vitrinaResult = await pool.query(
      `SELECT producto, precio::numeric FROM ventas_vitrina WHERE cliente_id = $1 AND estado = 'pendiente'`,
      [id]
    );

    // 4. Buscar deudas de servicios
    const serviciosResult = await pool.query(
      `SELECT servicio AS producto, precio::numeric FROM servicios_realizados WHERE cliente_id = $1 AND estado_pago = 'pendiente'`,
      [id]
    );

    const catalogo = catalogoResult.rows;
    const vitrina = vitrinaResult.rows;
    const servicios = serviciosResult.rows;

    // Función para sumar totales
    const calcularTotal = (items) =>
      items.reduce((acc, item) => acc + Number(item.precio), 0);

    // Armar respuesta final
    const detalles = {
      cliente,
      deudas: {
        catalogo: {
          items: catalogo,
          total: calcularTotal(catalogo),
        },
        vitrina: {
          items: vitrina,
          total: calcularTotal(vitrina),
        },
        servicios: {
          items: servicios,
          total: calcularTotal(servicios),
        },
      },
      total_general:
        calcularTotal(catalogo) +
        calcularTotal(vitrina) +
        calcularTotal(servicios),
    };

    res.json(detalles);
  } catch (error) {
    console.error("Error al obtener detalles del cliente:", error.message);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

module.exports = {
  getClienteDetalles,
};
