const UsuariosDaoMongo = require('../daos/usuarios/UsuariosDaoMongo')
const dbUsers = new UsuariosDaoMongo()

async function getRoot(req, res) {
      return res.render('pages/index.ejs', {
            loggedUser: req.session.loggedUser || false, 
            loggedAdmin: req.session.loggedAdmin || false, 
            email: req.session.email || null
      })
}

async function getSignup(req, res) {
      return res.render('pages/signup.ejs')
}

async function postSignup (req, res) {
      return res.redirect('/')
}

async function getFailsignup (req, res) {
      logger.info('error en signup');
      return res.render('pages/signup-error.ejs', {});
}

async function postLogin (req, res) {
      return res.redirect('/')
}

async function getFailLogin (req, res) {
      logger.info('error en login');
      return res.render('pages/login-error.ejs', {});
}

async function getLogout (req, res) {
      let email = req.session.email;
      req.session.destroy( error => {
            if (error) {
                res.send({status: 'Logout Error', body: error})
            }
      })
      return res.redirect('/')
}

async function failRoute(req, res){
      return res.status(404).render('pages/routing-error.ejs', {});
}

async function checkLogged (req, res, next) {
      let loggedAdmin = req.session.loggedAdmin
      let loggedUser = req.session.loggedUser
      if (loggedAdmin || loggedUser){
            next()
      } else {
            return res.redirect('/')
      }
}

async function checkAuthentication(req, res, next) {
      let {email, password} = req.body
      if (email && password){
            const auth = await dbUsers.authentication(email, password)
            if (auth){
                  if (email == 'admin@admin'){
                        req.session.loggedAdmin = true
                        req.session.loggedUser = false
                  }

                  if (email != 'admin@admin'){
                        req.session.loggedAdmin = false
                        req.session.loggedUser = true
                  }
                  req.session.email = email
                  next()
            } else {
                  return res.json({error: 'Contraseña incorrecta'})
            }
      } else {
            return res.json({error: 'Alguno de los datos ingresados es incorrecto'})
      }
}

async function checkUser(req, res, next){
      let {email, password} = req.body
      if (email && password){
            const user = await dbUsers.checkUser(email)
            if(user){
                  return res.json({error: 'Ya existe un usuario con ese email'})
            } 
            if(!user){
                  await dbUsers.createUser(email, password)
                  next()
            }
      }
}



module.exports = {
      getRoot, 
      getSignup, 
      postSignup, 
      getFailsignup, 
      postLogin, 
      getFailLogin, 
      getLogout, 
      failRoute, 
      checkLogged,
      checkUser,
      checkAuthentication
}