/// <reference types="cypress" />
import contrato from '../contracts/usuarios.contract'

describe('Testes da Funcionalidade Usuários', () => {

  it('Deve validar contrato de usuários', () => {
    cy.request('usuarios').then(response =>{
      return contrato.validateAsync(response.body)
    })
  });

  it('Deve listar usuários cadastrados', () => {
    cy.request({
      method: 'GET',
      url: 'usuarios'
    }).should((response) =>{
      expect(response.status).equal(200)
      expect(response.body).to.have.property('usuarios')
  })
  });

  it('Deve cadastrar um usuário com sucesso', () => {
    let email = 'fulano' + Math.floor(Math.random() * 100000) + '@gmail.com'
    cy.cadastrarUsuario('Fulaninho', email, 'teste123')
    .should((response) =>{
      expect(response.body.message).equal('Cadastro realizado com sucesso')
      expect(response.status).equal(201)

    })
  });

  it('Deve validar um usuário com email inválido', () => {
    cy.cadastrarUsuario('Fulaninho', 'fulaninho@gmail.com', 'teste123')
    .should((response) =>{
      expect(response.body.message).equal('Este email já está sendo usado')
      expect(response.status).equal(400)
    })
  });

  it('Deve editar um usuário previamente cadastrado', () => {
    let email = 'fulano' + Math.floor(Math.random() * 100000) + '@gmail.com'
    cy.cadastrarUsuario('Usuario editado', email, 'teste123')
    .then((response) =>{
      let id = response.body._id
      cy.log(response.body._id)//para ver o id
      cy.request({
        method: 'PUT',
        url: `usuarios/${id}`,
        body:{
          "nome": 'Usuario editado',
          "email": email,
          "password": "teste",
          "administrador": "true"
        }
      }).should((response) =>{
        expect(response.body.message).equal('Registro alterado com sucesso')
        expect(response.status).equal(200)
    })
    })
    

  });

  it('Deve deletar um usuário previamente cadastrado', () => {
    cy.cadastrarUsuario('Fulaninho que vai ser deletado', 'fulano69623@gmail.com', 'teste123')
    .then((response) => {
      let id = response.body._id
      cy.request({
        method: 'DELETE',
        url: `usuarios/${id}`
      }).should((response) =>{
        expect(response.status).equal(200)
      })
    })
   
  });


});
