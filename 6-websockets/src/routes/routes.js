function getRoot(req, res) {
      res.render('pages/index.ejs', {loggedUser: false, loggedAdmin: false, email: null})
}

function getSignup(req, res) {
      res.render('pages/signup.ejs')
}

function postSignup (req, res) {
      if (req.body.password1 == req.body.password2){
            if (req.isAuthenticated()){
                  res.redirect('/')
            } else {
                  res.json({error: 'Error de autenticación'})
            }
      } else {
            res.json({error: 'Las contraseñas no son idénticas'})
      }
}

function getFailsignup (req, res) {
      console.log('error en signup');
      res.render('pages/signup-error.ejs', {});
}

function postLogin (req, res) {
      if(req.isAuthenticated()){
            res.redirect('/profile')
      } else {
            res.redirect('/')
      }
}

function getFaillogin (req, res) {
      console.log('error en login');
      res.render('pages/login-error.ejs', {});
}

function getProfile(req, res){
      if(req.isAuthenticated()){
            res.render('pages/index.ejs', {loggedUser: true, loggedAdmin: false, email: req.session.email})
      } else {
            res.redirect('/')
      }
}

function getLogout (req, res) {
      let email = req.session.email;
      req.logout( (err) => {
            if (!err) {
                  res.render('pages/index.ejs', {loggedUser: false, loggedAdmin: false, email: email})
            } 
      });
}

function failRoute(req, res){
      res.status(404).render('pages/routing-error.ejs', {});
}

function checkAuthentication(req, res, next) {
      if (req.isAuthenticated()) {
            next();
      } else {
            res.redirect("/");
      }
}


module.exports = {getRoot, getSignup, postSignup, getFailsignup, postLogin, getFaillogin, getProfile, getLogout, failRoute, checkAuthentication}