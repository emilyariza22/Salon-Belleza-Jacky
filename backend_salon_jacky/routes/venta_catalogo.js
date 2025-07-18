// routes/venta_catalogo.js
const express = require("express");
const router = express.Router();
const { crearVentaCatalogo } = require("../controllers/ventaCatalogoController");

router.post("/", crearVentaCatalogo);

module.exports = router;
