const ContainerMongo = require('../../containers/ContenedorMongo')
const UserModel = require('../../models/usuarios')
const {validatePass} = require('../../utils/passValidator');
const {createHash} = require('../../utils/hashGenerator');

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
                        return false
                  }
            } else {
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
                        return
                  }
            })
      }

}

module.exports = UsuariosDaoMongo

