const UsuariosDaoMongo = require('../daos/usuarios/UsuariosDaoMongo')
const dbUsers = new UsuariosDaoMongo()

function getRoot(req, res) {
      res.render('pages/index.ejs', {
            loggedUser: req.session.loggedUser || false, 
            loggedAdmin: req.session.loggedAdmin || false, 
            email: req.session.email || null
      })
}

function getSignup(req, res) {
      res.render('pages/signup.ejs')
}

function postSignup (req, res) {
      res.redirect('/')
}

function getFailsignup (req, res) {
      console.log('error en signup');
      res.render('pages/signup-error.ejs', {});
}

function postLogin (req, res) {
      res.redirect('/')
}

function getFailLogin (req, res) {
      console.log('error en login');
      res.render('pages/login-error.ejs', {});
}

function getLogout (req, res) {
      let email = req.session.email;
      req.session.destroy( error => {
            if (error) {
                res.send({status: 'Logout Error', body: error})
            }
      })
      res.redirect('/')
}

function failRoute(req, res){
      res.status(404).render('pages/routing-error.ejs', {});
}

function checkLogged (req, res, next) {
      let loggedAdmin = req.session.loggedAdmin
      let loggedUser = req.session.loggedUser
      if (loggedAdmin || loggedUser){
            next()
      } else {
            res.redirect('/')
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
                  res.json({error: 'Contraseña incorrecta'})
            }
      } else {
            res.json({error: 'Alguno de los datos ingresados es incorrecto'})
      }
}

async function checkUser(req, res, next){
      let {email, password} = req.body
      if (email && password){
            const user = await dbUsers.checkUser(email)
            if(user){
                  res.json({error: 'Ya existe un usuario con ese email'})
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