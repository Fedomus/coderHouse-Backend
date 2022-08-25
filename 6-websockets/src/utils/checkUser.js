const UsuariosDaoMongo = require('../daos/usuarios/UsuariosDaoMongo')
const dbUsers = new UsuariosDaoMongo()

function checkUser(req, res, next){
      let email = req.body.email
      let password = req.body.password
      if (email && password){
            const user = dbUsers.checkUser(email)
            if(user){
                  res.json({error: 'Ya existe un usuario con ese email'})
            } else {
                  dbUsers.createUser(email, password)
                  next()
            }
      }
}

module.exports = { checkUser }