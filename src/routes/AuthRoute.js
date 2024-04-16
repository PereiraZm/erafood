const { Router } = require('express');
const usuarioService = require('../services/UsuarioService');
const { compararSenha, gerarToken } = require('../middlewares/AuthMiddleware');

const authRoute = Router();

authRoute.post('/login', async (req, res) => {
    const { email, senha } = req.body;
    try {
        const usuario = await usuarioService.verificaUsuarioPeloEmail(email);
        if (!usuario) {
            return res.status(400).json({ message: 'Email ou senha inválidos' });
        }

        const senhaCorreta = await compararSenha(senha, usuario.senha);
        if (!senhaCorreta) {
            return res.status(400).json({ message: 'Email ou senha inválidos' });
        }

        const token = gerarToken(usuario);
        return res.status(200).json({ auth_token: token });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao realizar o login' });
    }
});

module.exports = authRoute;