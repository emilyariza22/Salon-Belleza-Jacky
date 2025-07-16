const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
const serviciosRoutes = require('./routes/servicios');
const ventasRoutes = require('./routes/ventas');

app.use('/api/servicios', serviciosRoutes);
app.use('/api/ventas', ventasRoutes);

// Servidor en marcha
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
