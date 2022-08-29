const UsuariosDaoMongo = require('../daos/usuarios/UsuariosDaoMongo')
const dbUsers = new UsuariosDaoMongo()

async function checkUser(req, res, next){
      let email = req.body.email
      let password = req.body.password
      if (email && password){
            const user = await dbUsers.checkUser(email)
            if(user){
                  res.json({error: 'Ya existe un usuario con ese email'})
            } else {
                  await dbUsers.createUser(email, password)
                  next()
            }
      }
}

module.exports = { checkUser }