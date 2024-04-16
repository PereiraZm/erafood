const usuarioRepository = require('../repositories/UsuarioRepository');

class UsuarioService {
    async verificaUsuarioPeloEmail(email) {
        const usuario = await usuarioRepository.buscarUsuarioPorEmail(email);
        if (usuario == null) {
            throw new Error('Não foi possível buscar o usuário');
        }

        return usuario;
    }
}

module.exports = new UsuarioService();