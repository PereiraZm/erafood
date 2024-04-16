class Usuario {
    constructor(
        id,
        email,
        hash_senha,
        role
    ) {
        this.id = id;
        this.hash_senha = hash_senha;
        this.role = role;
    }

    getId() {
        return this.id;
    }

    setId(id) {
        this.id = id;
    }

    getEmail() {
        return this.email;
    }

    setEmail(email) {
        this.email = email;
    }

    getSenha() {
        return this.senha;
    }

    setSenha(senha) {
        this.senha = senha;
    }

    getRole() {
        return this.role;
    }

    setRole(role) {
        this.role = role;
    }
}

module.exports = Usuario;