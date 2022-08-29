const ContainerMongo = require('../../containers/ContenedorMongo')
const UserModel = require('../../models/usuarios')
const {validatePass} = require('../../utils/passValidator');
const {createHash} = require('../../utils/hashGenerator');
const logger = require('../../../logger')

class UsuariosDaoMongo extends ContainerMongo {

      constructor() {
            super(UserModel)
      }   

      async getByEmail(email) {
            const user = await this.model.findOne({email : email})
            return user
      }
      
      async authentication(email, password){
            const user = await this.model.findOne({email: email}) || false
            if (user){
                  if (validatePass(user, password)){
                        return true
                  } else {
                        logger.info('La contraseña es incorrecta');
                        return false
                  }
            } else {
                  logger.info('No se encontró usuario con ese nombre');
                  return false
            }
      }

      async checkUser(email){
            return await this.model.findOne({email: email}) || false
      }

      async createUser(email, password){
            const newUser = {
                  email:email,
                  password: createHash(password)
            }
            await this.model.create(newUser, (err, userWithId) => {
                  if(err){
                        logger.error('Hubo un error al guardar el usuario en la base de datos');
                        return
                  }
            })
      }

}

module.exports = UsuariosDaoMongo

