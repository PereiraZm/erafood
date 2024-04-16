const restauranteService = require('../services/RestauranteService');
const { Router } = require('express');
const { verificarToken, checarPermissaoCliente } = require('../middlewares/AuthMiddleware');

const restauranteRoute = Router();

restauranteRoute.get('/restaurantes/melhor-avaliacao', verificarToken, checarPermissaoCliente, async (_, res) => {
    const restaurantesMelhorAvaliados = await restauranteService.buscarRestaurantesMelhorAvaliacao();
    if (restaurantesMelhorAvaliados.Length === 0) {
        return res.status(204).json({ message: 'No momento não há nenhum com a melhor avaliação' });
    }
    
    return res.status(200).send(restaurantesMelhorAvaliados);
});
restauranteRoute.get('/restaurantes/frete_gratis', verificarToken, checarPermissaoCliente, async (req, res) => {
    try {
        const listaDeRestaurantes = await restauranteService.buscarRestaurantesFreteGratis();
        
        if (listaDeRestaurantes.Length === 0) {
            return res.status(204).json({ message: 'Não há restaurantes cadastrados no sistema com frete grátis' });
        }
        return res.status(200).send(listaDeRestaurantes);
    } catch (error) {
        return res.status(500).json({ message: 'Não foi possível buscar os restaurantes com frete grátis' });
    }
});
restauranteRoute.get('/restaurantes/:id', verificarToken, async (req, res) => {
    try {
        const idRestaurante = parseInt(req.params.id);
        const restaurante = await restauranteService.buscarRestaurante(idRestaurante);
        return res.status(200).send(restaurante);
    } catch (error) {
        return res.status(500).json({ message: 'Não foi possível buscar o restaurante' });
    }
});
restauranteRoute.get('/restaurantes', verificarToken, checarPermissaoCliente, async (req, res) => {
    try {
        const listaDeRestaurantes = await restauranteService.listarRestaurantes();
        if (listaDeRestaurantes.length === 0) {
            return res.status(404).json({ message: 'Não há restaurantes cadastrados no sistema' });
        }

        return res.status(200).json(listaDeRestaurantes);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erro interno do servidor' });
    }
});
restauranteRoute.post('/restaurantes', verificarToken, async (req, res) => {
    try {
        const restauranteReq = req.body;
        const novoRestaurante = await restauranteService.registrarRestaurante(restauranteReq);
        return res.status(201).json({ message: 'Restaurante registrado com sucesso ', novoRestaurante });
    } catch (error) {
        return res.status(400).json({ message: 'Não foi possível registrar o restaurante. verifique os dados informados e tente novamente' });
    }
});
restauranteRoute.put('/restaurantes/:id', verificarToken, async (req, res) => {
    try {
        const idRestaurante = parseInt(req.params.id);
        const restauranteExistente = await restauranteService.buscarRestaurante(idRestaurante);
        if (!restauranteExistente) {
            return res.status(404).json({ message: 'Restaurante não encontrado' });
        }
        
        const restauranteAModificar = req.body;
        restauranteAModificar.id = idRestaurante;
        
        await restauranteService.alterarRestaurante(restauranteAModificar);
        return res.status(200).json({ message: 'Restaurante alterado com sucesso ' });
    } catch (error) {
        return res.status(400).json({ message: 'Não foi possível modificar o restaurante' });
    }
});
restauranteRoute.delete('/restaurantes/:id', verificarToken, async (req, res) => {
    try {
        const idRestaurante = req.params.id;
        await restauranteService.removerRestaurante(idRestaurante)
        return res.status(200).json({ message: 'Cliente removido com sucesso' });
    } catch (error) {
        return res.status(400).json({ message: 'Não foi possível remover o cliente' });
    }
});

module.exports = restauranteRoute;