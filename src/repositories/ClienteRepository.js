const db = require('../data/config');

class ClienteRepository {
  async AdicionaCliente(cliente) {
    try {
      await db.query('BEGIN');
      const scriptUsuario = `
        INSERT INTO usuarios (email, senha, role)
        VALUES ($1, $2, 'cliente')
        RETURNING id
      `;
      const valuesUsuario = [cliente.email, cliente.senha];

      const usuarioResult = await db.query(scriptUsuario, valuesUsuario);
      const usuarioId = usuarioResult.rows[0].id;

      // Insere os dados do restaurante na tabela restaurantes
      const scriptCliente = `
        INSERT INTO clientes (usuario_id, nome, sobrenome, cpf, telefone, endereco)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
      `;
      const valuesCliente = [
        usuarioId,
        cliente.nome,
        cliente.sobrenome,
        cliente.cpf,
        cliente.telefone,
        cliente.endereco,
      ];

      const clienteResult = await db.query(scriptCliente, valuesCliente);
      const novoCliente = clienteResult.rows[0];

      await db.query('COMMIT');

      return novoCliente;
    } catch (error) {
      // Em caso de erro, faz rollback da transação
      await db.query('ROLLBACK');
      console.error('Erro ao adicionar cliente:', error);
      throw new Error('Não foi possível registrar o cliente. Verifique os dados informados e tente novamente.');
    }
  }

  async listarClientes() {
    const query = `
      SELECT clientes.*, usuarios.email
      FROM clientes
      INNER JOIN usuarios ON clientes.usuario_id = usuarios.id
    `;

    const { rows } = await db.query(query);
    const [ clientes ] = rows;
    return clientes;
  }


  async listarCliente(id) {
    try {
      const query = `
        SELECT *
        FROM clientes
        WHERE id = $1
      `
      const values = [id]

      const { rows } = await db.query(query, values)
      const [cliente] = rows

      return cliente || []

    } catch (error) {
      throw new DatabaseError('ID Query Error', error)
    }
  }

  async atualizarCliente(cliente) {
    const script = `
      UPDATE clientes
      SET 
        nome = $1,
        sobrenome = $2,
        email = $3,
        cpf = $4,
        telefone = $5,
        endereco = $6,
      WHERE id = $7
    `;

    const values = [
      cliente.nome, cliente.sobrenome,
      cliente.email, cliente.cpf,
      cliente.telefone, cliente.endereco,
      cliente.id
    ];
    await db.query(script, values)
  }

  async removerClientes() {
    const script = `
      TRUNCATE TABLE clientes
    `

    await db.query(script)
  }

  async removerCliente(id) {
    const script = `
      DELETE FROM clientes
      WHERE id = $1
    `
    const values = [id]

    await db.query(script, values)
  }
}

module.exports = new ClienteRepository();