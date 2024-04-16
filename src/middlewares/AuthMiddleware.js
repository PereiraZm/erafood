const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
dotenv.config();

const secret = process.env.SECRET_KEY;

function verificarToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ message: 'Token não fornecido' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Token inválido' });
    }

    jwt.verify(token, secret, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Token inválido' });
        }

        // Se o token for válido, adicione os dados decodificados ao objeto de solicitação (req)
        req.user = decoded;
        next();
    });
}

function gerarToken(usuario) {
    const payload = {
        id: usuario.id,
        email: usuario.email,
        role: usuario.role
    };
    
    const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '2h' });
    return token;
}

function compararSenha(senhaFornecida, senhaHash) {
    const senhaVerificada = bcrypt.compare(senhaFornecida, senhaHash);
    return senhaVerificada;
}

function checarPermissaoCliente(req, res, next) {
    if (req.user.role !== 'cliente' || (req.method === 'GET' && req.originalUrl.startsWith('/restaurantes'))) {
        return next(); // Permitir acesso apenas para clientes às rotas GET de restaurantes
    }

    return res.status(403).json({ message: 'Você não tem permissão para acessar a rota' });
}

function checarPermissaoRestaurante(req, res, next) {
    if (req.user.role !== 'restaurante' || (req.method === 'GET' && req.originalUrl.startsWith('/clientes'))) {
        return next(); // Permitir acesso apenas para clientes às rotas GET de restaurantes
    }

    return res.status(403).json({ message: 'Você não tem permissão para acessar a rota' });
}

module.exports = {
    verificarToken,
    gerarToken,
    checarPermissaoCliente,
    checarPermissaoRestaurante,
    compararSenha
};