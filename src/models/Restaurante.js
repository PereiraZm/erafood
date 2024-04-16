const Usuario = require('./Usuario');

class Restaurante extends Usuario {
    constructor(
        id,
        nome,
        email,
        hash_senha,
        cnpj,
        telefone,
        endereco,
        avaliacao_geral,
        frete_gratis
    ) {
        super(id, hash_senha, 'restaurante')
        this.nome = nome;
        this.email = email;
        this.cnpj = cnpj;
        this.telefone = telefone;
        this.endereco = endereco;
        this.avaliacao_geral = avaliacao_geral;
        this.frete_gratis = frete_gratis;
    }
}

module.exports = Restaurante;