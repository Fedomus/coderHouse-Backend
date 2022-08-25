const UsuariosDaoMongo = require('../daos/usuarios/UsuariosDaoMongo')
const dbUsers = new UsuariosDaoMongo()

async function checkAuthentication(req, res, next) {
      let email = req.body.email
      let password = req.body.password
      if (email && password){
            const auth = await dbUsers.authentication(email, password)
            if (auth){
                  next()
            } else {
                  res.json({error: 'El usuario no existe o la contraseña incorrecta'})
            }
      } else {
            res.json({error: 'Alguno de los datos ingresados es incorrecto'})
      }
}

module.exports = {checkAuthentication}

