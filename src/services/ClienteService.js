const clienteRepository = require('../repositories/ClienteRepository');
const bcrypt = require('bcryptjs');

class ClienteService {
    async criaCliente(cliente) {
        const senhaOriginal = cliente.senha;
        const hashedSenha = await bcrypt.hash(senhaOriginal, 10); // 10 é o custo do hashing, quanto maior, mais seguro, mas também mais lento

        const clienteComSenhaHashed = {
            ...cliente,
            senha: hashedSenha
        };

        const novoCliente = await clienteRepository.AdicionaCliente(clienteComSenhaHashed);
        if (!novoCliente) {
            throw new Error('Não foi possível registrar o cliente');
        }

        return novoCliente;
    }

    async listarClientes() {
        const listaClientes = await clienteRepository.listarClientes();
        // if (listaClientes == null) {
        //     throw new Error('Não foi possível listar os clientes ou não há clientes cadastrados');
        // }

        return listaClientes || [];
    }

    async buscarCliente(id) {
        const cliente = await clienteRepository.listarCliente(id);
        if (cliente == null) {
            throw new Error('Não foi possível encontrar o cliente');
        }

        return cliente;
    }

    async alterarCiente(cliente) {
        return await clienteRepository.atualizarCliente(cliente)
    }

    async removerClientes() {
        return await clienteRepository.removerClientes();
    }

    async removerCliente(id) {
        const cliente = await clienteRepository.removerCliente(id);
        return cliente;
    }
}

module.exports = new ClienteService();