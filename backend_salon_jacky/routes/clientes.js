// routes/clientes.js
const express = require("express");
const router = express.Router();
const { getClienteDetalles } = require("../controllers/clientesController");

// Ruta para obtener detalles y deudas del cliente
router.get("/:id/detalles", getClienteDetalles);

module.exports = router;
