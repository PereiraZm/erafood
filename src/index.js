const express = require('express');
const clienteRoute = require('./routes/ClienteRoute');
const restauranteRoute = require('./routes/RestauranteRoute');
const authRoute = require('./routes/AuthRoute');
const PORT = process.env.PORT;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(authRoute);
app.use(clienteRoute);
app.use(restauranteRoute);

app.listen(PORT, () => { console.log(`Servidor rodando em http://localhost:${PORT}/`)})