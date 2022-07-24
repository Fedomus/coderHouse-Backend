const express = require('express')
const { Server: HttpServer } = require('http')
const { Server: IOServer } = require('socket.io')
const app = express()
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)
const port = process.env.PORT || 8080;

//----------------Se inicia el servidor---------------------//
httpServer.listen(port, function() {
      console.log(`Servidor corriendo en puerto ${port}`);
});
httpServer.on('error', error => console.log(`Error en el servidor ${error}`))

//-----------------------------IMPORTS--------------------------------//
//Sesion
const session = require('express-session')
//Routes
const test = require('./src/routes/testApi')
const routes = require('./src/routes/routes')
//Usuarios
const UsuariosDaoMongo = require('./src/daos/usuarios/UsuariosDaoMongo')
const dbUsers = new UsuariosDaoMongo()
//AUTENTICACION
const { TIEMPO_EXPIRACION } = require('./src/config/globals')
const {validatePass} = require('./src/utils/passValidator');
const {createHash} = require('./src/utils/hashGenerator')
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const UserModel = require('./src/models/usuarios');

//--------------------TEMPLATES---------------------//
app.set('view engine', 'ejs');
app.set('views', './src/views');

//---------------------MIDDLEWARES----------------------//
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
//SESSION
app.use(session({
      secret: 'coderhouse',
      cookie: {
          httpOnly: false,
          secure: false,
          maxAge: parseInt(TIEMPO_EXPIRACION)
      },
      rolling: true,
      resave: true,
      saveUninitialized: true
  }))

//PASSPORT
app.use(passport.initialize())
app.use(passport.session())
passport.use('login', new LocalStrategy(
      (email, password, callback) => {
            UserModel.findOne({ email: email }, (err, user) => {
                  if (err) {
                        return callback(err)
                  }
      
                  if (!user) {
                        console.log('No se encontro usuario');
                        return callback(null, false)
                  }
                  
                  if(!validatePass(user, password)) {
                        console.log('Invalid Password');
                        return callback(null, false)
                  }
      
                  return callback(null, user)
            })
      }
))
passport.use('signup', new LocalStrategy(
      {passReqToCallback: true}, (email, password1, callback) => {
            UserModel.findOne({ email: email }, (err, user) => {
                  
                  if (err) {
                        console.log('Hay un error al registrarse');
                        return callback(err)
                  }
      
                  if (user) {
                        console.log('El usuario ya existe');
                        return callback(null, false)
                  }
                  const newUser = {
                        email: email,
                        password: createHash(password1)
                  }
                 
                  UserModel.create(newUser, (err, userWithId) => {

                        if (err) {
                              console.log('Hay un error al registrarse');
                              return callback(err)
                        }

                        console.log(userWithId);

                        console.log('Registro de usuario satisfactorio');
                        
                        return callback(null, userWithId)
                        
                  })
            })
      }
))
passport.serializeUser((user, callback) => {
      callback(null, user._id)
})
passport.deserializeUser((id, callback) => {
      UserModel.findById(id, callback)
})

//RUTAS
app.use("/test", test);


//---------------------------------------------------RUTAS----------------------------------------------------------------//
//INDEX
app.get('/', routes.getRoot)

//SIGNUP
app.get('/signup', routes.getSignup)
app.post('/signup', passport.authenticate('signup', {failureRedirect: '/failsignup'}), routes.postSignup);
app.get('/failsignup', routes.getFailsignup);

//LOGIN
app.post('/login', passport.authenticate('login', { failureRedirect: '/faillogin' }), routes.postLogin);
app.get('/faillogin', routes.getFaillogin);

//PROFILE
app.get('/profile', routes.checkAuthentication, routes.getProfile)

//LOGOUT
app.get('/logout', routes.getLogout);

//  FAIL ROUTE
app.get('*', routes.failRoute);


//------------------------------SOCKETS-----------------------------//
//Importaciones
let MensajesDaoArchivo = require("./src/daos/mensajes/MensajesDaoArchivo")
let dbMensajes = new MensajesDaoArchivo();
let ProductosDaoSql = require("./src/daos/productos/ProductosDaoSql");
let dbProductos = new ProductosDaoSql();
//Mensajes normalizados
const {listarMensajesNormalizados} = require('./src/normalizacion/normalizacionMensajes')
//
io.on('connection', async (socket) => {
      const mensajes = await listarMensajesNormalizados();
      const productos = await dbProductos.getAll().then((result) => {return result})   
      console.log('Un cliente se ha conectado');
      io.sockets.emit('productos', productos);
      io.sockets.emit('mensajes', mensajes);
      socket.on('new-message', async data => {
            const user = await dbUsers.getByEmail(data.email)
            dbMensajes.save(data.texto, user);
            io.sockets.emit('mensajes', mensajes);
      });
      socket.on('new-product', async data => {
            await dbProductos.save(data);
            io.sockets.emit('productos', productos);
      });
})



