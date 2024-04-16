const db = require('../data/config');

class RestauranteRepository {
  async AdicionaRestaurante(restaurante) {
    try {
      // Inicia uma transação
      await db.query('BEGIN');

      // Insere os dados do usuário na tabela usuarios
      const scriptUsuario = `
            INSERT INTO usuarios (email, senha, role)
            VALUES ($1, $2, 'restaurante')
            RETURNING id
        `;
      const valuesUsuario = [restaurante.email, restaurante.senha];

      const usuarioResult = await db.query(scriptUsuario, valuesUsuario);
      const usuarioId = usuarioResult.rows[0].id;

      // Insere os dados do restaurante na tabela restaurantes
      const scriptRestaurante = `
            INSERT INTO restaurantes (usuario_id, nome, cnpj, telefone, endereco, avaliacao_geral, frete_gratis)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *
        `;
      const valuesRestaurante = [
        usuarioId,
        restaurante.nome,
        restaurante.cnpj,
        restaurante.telefone,
        restaurante.endereco,
        restaurante.avaliacao_geral,
        restaurante.frete_gratis
      ];

      const restauranteResult = await db.query(scriptRestaurante, valuesRestaurante);
      const novoRestaurante = restauranteResult.rows[0];

      // Finaliza a transação
      await db.query('COMMIT');

      return novoRestaurante;
    } catch (error) {
      // Em caso de erro, faz rollback da transação
      await db.query('ROLLBACK');
      console.error('Erro ao adicionar restaurante:', error);
      throw new Error('Não foi possível registrar o restaurante. Verifique os dados informados e tente novamente.');
    }
  }

  async listarRestaurantes() {
    const query = `
      SELECT restaurantes.*, usuarios.email
      FROM restaurantes
      INNER JOIN usuarios ON restaurantes.usuario_id = usuarios.id
    `;

    const { rows } = await db.query(query);
    return rows;
  }

  async listarRestaurantesFreteGratis() {
    const query = `
      SELECT * FROM restaurantes
      WHERE frete_gratis = true
    `;

    const { rows } = await db.query(query)
    return rows || [];
  }

  async listarRestaurantesPorMelhorAvaliacao() {
    try {
      const query = `
        SELECT *
        FROM restaurantes
        ORDER BY avaliacao_geral DESC
        LIMIT 10
      `;
      const { rows } = await db.query(query);
      return rows;
    } catch (error) {
      throw new Error('Erro ao listar os restaurantes por melhor avaliação');
    }
  }

  async listarRestaurante(id) {
    try {
      const query = `
        SELECT * FROM restaurantes
        WHERE id = $1
      `
      const values = [id]

      const { rows } = await db.query(query, values)
      const [restaurante] = rows;
      console.log(restaurante);
      return restaurante;
    } catch (error) {
      throw new DatabaseError('ID Query Error', error)
    }
  }

  async atualizarRestaurante(restaurante) {
    const script = `
      UPDATE restaurantes
      SET 
        nome = $1,
        cnpj = $2,
        telefone = $3,
        endereco = $4,
        avaliacao_geral = $5,
        frete_gratis = $6
      WHERE id = $7
    `;

    const values = [
      restaurante.nome,
      restaurante.cnpj,
      restaurante.telefone,
      restaurante.endereco,
      restaurante.avaliacao_geral,
      restaurante.frete_gratis,
      restaurante.id
    ];

    try {
      await db.query(script, values);
    } catch (error) {
      console.error('Erro ao atualizar restaurante:', error);
      throw new Error('Não foi possível atualizar o restaurante. Verifique os dados informados e tente novamente.');
    }
  }

  async removerRestaurantes() {
    const script = `
      TRUNCATE TABLE restaurantes
    `

    await db.query(script)
  }

  async removerRestaurante(id) {
    const script = `
      DELETE FROM restaurantes
      WHERE id = $1
    `
    const values = [id]

    await db.query(script, values)
  }
}

module.exports = new RestauranteRepository();