const express = require('express');
const router = express.Router();
const pool = require('../db');

// Ruta para registrar un servicio
router.post('/', async (req, res) => {
  try {
    const {
      cliente,
      tipo_corte, // 'hombre' o 'mujer'
      corte_completo,
      valor_corte_completo,
      barba,
      valor_barba,
      cejas,
      valor_cejas,
      corte_incompleto,
      valor_corte_incompleto,
      tinturado,
      valor_tinturado,
      planchado,
      valor_planchado,
      planchado_semipermanente,
      valor_planchado_semipermanente,
      keratina,
      valor_keratina,
      pago
    } = req.body;

    // Precios por defecto
    const PRECIO_CORTE_MUJER = 14000;
    const PRECIO_CORTE_HOMBRE = 10000;
    const PRECIO_BARBA_DEF = 4000;
    const PRECIO_CEJAS_CUCHILLA_DEF = 4000;
    const PRECIO_CEJAS_CERA_DEF = 6000;
    const PRECIO_CORTE_INCOMPLETO_DEF = 7000;
    const PRECIO_TINTURADO_DEF = 20000;
    const PRECIO_PLANCHADO_DEF = 10000;
    const PRECIO_PLANCHADO_SEMI_DEF = 30000;
    const PRECIO_KERATINA_DEF = 80000;

    let total = 0;
    let tipoCejas = null;

    // Corte completo
    if (corte_completo) {
      let precioCorte = valor_corte_completo
        ? parseInt(valor_corte_completo)
        : tipo_corte === 'hombre'
        ? PRECIO_CORTE_HOMBRE
        : PRECIO_CORTE_MUJER;
      total += precioCorte;
    }

    // Barba
    if (barba) {
      const valor = valor_barba ? parseInt(valor_barba) : PRECIO_BARBA_DEF;
      total += valor;
    }

    // Cejas
    if (cejas === 'cuchilla') {
      tipoCejas = 'cuchilla';
      const valor = valor_cejas ? parseInt(valor_cejas) : PRECIO_CEJAS_CUCHILLA_DEF;
      total += valor;
    } else if (cejas === 'cera') {
      tipoCejas = 'cera';
      const valor = valor_cejas ? parseInt(valor_cejas) : PRECIO_CEJAS_CERA_DEF;
      total += valor;
    }

    // Corte incompleto
    if (corte_incompleto) {
      const valor = valor_corte_incompleto ? parseInt(valor_corte_incompleto) : PRECIO_CORTE_INCOMPLETO_DEF;
      total += valor;
    }

    // Tinturado
    if (tinturado) {
      const valor = valor_tinturado ? parseInt(valor_tinturado) : PRECIO_TINTURADO_DEF;
      total += valor;
    }

    // Planchado
    if (planchado) {
      const valor = valor_planchado ? parseInt(valor_planchado) : PRECIO_PLANCHADO_DEF;
      total += valor;
    }

    // Planchado semipermanente
    if (planchado_semipermanente) {
      const valor = valor_planchado_semipermanente
        ? parseInt(valor_planchado_semipermanente)
        : PRECIO_PLANCHADO_SEMI_DEF;
      total += valor;
    }

    // Keratina
    if (keratina) {
      const valor = valor_keratina ? parseInt(valor_keratina) : PRECIO_KERATINA_DEF;
      total += valor;
    }

    const deuda = total - pago;

    // Guardar en la base de datos
    const result = await pool.query(
      `INSERT INTO servicios (
        cliente, tipo_corte, corte_completo, barba, cejas, tipo_cejas, corte_incompleto,
        tinturado, planchado, planchado_semipermanente, keratina,
        valor_total, pago, deuda, fecha
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,CURRENT_DATE)
      RETURNING *`,
      [
        cliente,
        tipo_corte,
        corte_completo,
        barba,
        !!tipoCejas,
        tipoCejas,
        corte_incompleto,
        tinturado,
        planchado,
        planchado_semipermanente,
        keratina,
        total,
        pago,
        deuda
      ]
    );

    // Verificar deuda de vitrina
    const vitrinaResult = await pool.query(
      'SELECT SUM(deuda) AS deuda_vitrina FROM ventas WHERE cliente = $1 AND deuda > 0',
      [cliente]
    );

    const deudaVitrina = parseInt(vitrinaResult.rows[0].deuda_vitrina || 0);

    res.json({
      mensaje: 'Servicio registrado exitosamente',
      servicio: result.rows[0],
      deuda_vitrina: deudaVitrina > 0 ? deudaVitrina : 0
    });

  } catch (error) {
    console.error('Error registrando servicio:', error);
    res.status(500).json({ error: 'Error al registrar el servicio' });
  }
});

module.exports = router;
