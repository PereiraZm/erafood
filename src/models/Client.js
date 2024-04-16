const Usuario = require('./Usuario');

class Cliente extends Usuario {
    constructor(
        id,
        nome,
        sobrenome,
        email,
        hash_senha,
        cpf,
        telefone,
        endereco
    ) {
        super(id, hash_senha, 'cliente');
        this.nome = nome;
        this.sobrenome = sobrenome;
        this.email = email;
        this.cpf = cpf;
        this.telefone = telefone;
        this.endereco = endereco;
    }
}

module.exports = Cliente;