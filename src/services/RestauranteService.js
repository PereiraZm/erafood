const restauranteRepository = require('../repositories/RestauranteRepository');
const bcrypt = require('bcryptjs');

class RestauranteService {
    async registrarRestaurante(restaurante) {
        const senhaOriginal = restaurante.senha;
        const hashedSenha = await bcrypt.hash(senhaOriginal, 10); // 10 é o custo do hashing, quanto maior, mais seguro, mas também mais lento

        const restauranteComSenhaHashed = {
            ...restaurante,
            senha: hashedSenha
        };

        const novoRestaurante = await restauranteRepository.AdicionaRestaurante(restauranteComSenhaHashed);
        if (!novoRestaurante) {
            throw new Error('Não foi possível registrar o cliente');
        }

        return novoRestaurante;
    }

    async listarRestaurantes() {
        const listarRestaurantes = await restauranteRepository.listarRestaurantes();
        if (listarRestaurantes.Length === 0) {
            return [];
        }

        return listarRestaurantes;
    }

    async buscarRestaurante(id) {
        const restaurante = await restauranteRepository.listarRestaurante(id)
        if (restaurante == null) {
            throw new Error('Não foi possível encontrar o cliente');
        }
        return restaurante;
    }

    async buscarRestaurantesFreteGratis() {
        const restaurantes = await restauranteRepository.listarRestaurantesFreteGratis();
        if (restaurantes == null) {
            throw new Error('Não foi possível encontrar o cliente');
        }
        return restaurantes;
    }

    async buscarRestaurantesMelhorAvaliacao() {
        const restaurantes = await restauranteRepository.listarRestaurantesPorMelhorAvaliacao();
        if (restaurantes == null) {
            throw new Error('Não foi possível encontrar o cliente');
        }
        return restaurantes;
    }

    async alterarRestaurante(restaurante) {
        const restauranteAModicar = await restauranteRepository.atualizarRestaurante(restaurante);
        return restauranteAModicar; 
    }

    async removerRestaurantes() {
        return await restauranteRepository.removerRestaurantes();
    }

    async removerRestaurante(id) {
        const restaurante = await restauranteRepository.removerRestaurante(id);
        return restaurante;
    }
}

module.exports = new RestauranteService();