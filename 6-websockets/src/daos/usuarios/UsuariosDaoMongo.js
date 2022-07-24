const {MONGO_URI} = require('../../config/globals.js')
const mongoose = require('mongoose')
const ContainerMongo = require('../../containers/ContenedorMongo')
const UserModel = require('../../models/usuarios')

class UsuariosDaoMongo extends ContainerMongo {

            constructor() {
                  super(UserModel)
            }
      
            getByEmail(email) {
                  const usuarios = this.getAll()
                  const user = usuarios.find(user => user.email == email)
                  return user
            }

}

module.exports = UsuariosDaoMongo