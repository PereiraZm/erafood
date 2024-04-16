const clienteService = require('../services/ClienteService');
const { Router } = require('express');
const { verificarToken, checarPermissaoRestaurante } = require('../middlewares/AuthMiddleware');

const clienteRoute = Router();

clienteRoute.post('/clientes', verificarToken, async (req, res) => {
    try {
        const clienteReq = req.body;
        const novoCliente = await clienteService.criaCliente(clienteReq);
        return res.status(201).json({ message: 'Cliente registrado com sucesso ', novoCliente });
    } catch (error) {
        return res.status(400).json({ message: 'Não foi possível registrar o cliente. verifique os dados informados e tente novamente' });
    }
});
clienteRoute.get('/clientes', verificarToken, checarPermissaoRestaurante, async (req, res) => {
    const listaDeClientes = await clienteService.listarClientes();
    if (listaDeClientes == null) {
        return res.status(404).json({ message: 'Não foi possível listar os clientes' });
    }

    return res.status(200).send(listaDeClientes);
});
clienteRoute.get('/clientes/:id', verificarToken, async (req, res) => {
    try {
        const idCliente = req.params.id;
        const cliente = await clienteService.buscarCliente(idCliente);
        return res.status(200).send(cliente);            
    } catch (error) {
        return res.status(400).json({ message: 'Não foi possível buscar o cliente' });
    }
});
clienteRoute.put('/clientes/:id', verificarToken, async (req, res) => {
    try {
        const idCliente = req.params.id;
        const clienteAModificar = req.body;
        clienteAModificar.id = idCliente;
        await clienteService.alterarCiente(clienteAModificar);
        return res.status(200).json({ message: 'Cliente alterado com sucesso '});            
    } catch (error) {
        return res.status(400).json({ message: 'Não foi possível modificar o cliente' });
    }
});
clienteRoute.delete('/clientes/:id', verificarToken, async (req, res) => {
    try {
        const idCliente = req.params.id;
        const cliente = await clienteService.removerCliente(idCliente);
        return res.status(200).json({ message: 'Cliente removido com sucesso' });            
    } catch (error) {
        return res.status(400).json({ message: 'Não foi possível remover o cliente' });
    }
});

module.exports = clienteRoute;