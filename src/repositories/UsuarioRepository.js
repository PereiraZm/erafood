const db = require('../data/config');

class UsuarioRepository {
    async buscarUsuarioPorEmail(email) {
        const query = `
            SELECT * FROM usuarios
            WHERE email = $1
        `;

        const values = [email];
        const { rows } = await db.query(query, values);
        const [ usuario ] = rows;
        return usuario;
    }
}

module.exports = new UsuarioRepository();