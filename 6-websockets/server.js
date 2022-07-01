//--------------------Servidor express-----------------//
const express = require('express')
const { Server: HttpServer } = require('http')
const { Server: IOServer } = require('socket.io')

//----------------Se inicializa la aplicación----------------//
const app = express()
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)
const port = process.env.PORT || 8080;

//----------------Se inicia el servidor---------------------//
httpServer.listen(port, function() {
      console.log('Servidor corriendo en http://localhost:8080');
});

//------------Persistencia de sesion MongoDB------------//
const session = require('express-session')
const cookieParser = require('cookie-parser')
const MongoStore = require('connect-mongo')
const advancedOptions = { useNewUrlParser:true, useUnifiedTopology: true }

//-------------------------------Routers--------------------------//
const test = require('./src/routes/testApi')
const auth = require('./src/routes/authentications');

//------------------------Usuarios-------------------------//
const UsersDaoArchivo = require('./src/daos/users/UsersDaoArchivo')
const dbUsers = new UsersDaoArchivo()

//Seteo de EJS
app.set('view engine', 'ejs');


//---------------------Middlewares----------------------//
// app.set('views', './views');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

app.use("/authentication", auth)
app.use("/test", test);

app.use(cookieParser())
app.use(session({
      store: MongoStore.create({
            mongoUrl: 'mongodb+srv://test:test@cluster0.b3jaw.mongodb.net/appchat?retryWrites=true&w=majority' ,
            mongoOptions: advancedOptions
      }),
      secret: 'coderhouse',
      resave: false,
      saveUninitialized: false,
      cookie: {
            maxAge: 6000000
      }
}))


//---------------------------------------------------RUTAS----------------------------------------------------------------//
//Home
app.get('/', (req, res) => {
      if(req.session.loggedAdmin){
            res.render('pages/index.ejs', {loggedUser: false, loggedAdmin: true, username: req.session.username, signup: false})
      } else if (req.session.loggedUser){
            res.render('pages/index.ejs', {loggedUser: true, loggedAdmin: false, username: req.session.username, signup: false})
      } else {
            res.render('pages/index.ejs', {loggedUser: false, loggedAdmin: false, username: null, signup: false})
      }
})

//Signup
app.get('/signup', (req, res) => {
      res.render('pages/index.ejs', {loggedUser: false, loggedAdmin: false, username: null, signup: true})
})
app.post('/signup', (req, res) => {
      const { email, nombre, apellido, edad, alias, avatar, password } = req.body || null
      if(email && nombre && apellido && edad && alias && avatar && password){
            const user = {
                  email: email, 
                  nombre: nombre, 
                  apellido: apellido, 
                  edad: edad, 
                  alias: alias, 
                  avatar: avatar, 
                  password: password
            }
            dbUsers.save(user)
      } else {
            res.json({error: 'debe completar todos los campos'})
      }
      res.redirect('/')
})

//Login
app.post('/login', (req, res) => {
      const { username, password } = req.body || null
      const user = dbUsers.getByName(username)
      console.log(user);
      if(user){
            if(user.usuario.nombre == 'admin'){
                  if (password == user.password){
                        req.session.username = username
                        req.session.loggedAdmin=true
                        req.session.loggedUser=false
                        res.redirect('http://localhost:8080/')
                  } else {
                        res.json({error:'Contraseña incorrecta'})
                  }
            } else {
                  if (password == user.password){
                        req.session.username = username
                        req.session.loggedAdmin=false
                        req.session.loggedUser=true
                        res.redirect('http://localhost:8080/')
                  } else {
                        res.json({error:'Contraseña incorrecta'})
                  }
            }
      } else {
                  res.json({error: 'No existe un usuario con ese nombre'})
      }
})


//Logout
app.get('/logout', (req, res) => {
      let username = req.session.username;
      req.session.destroy( error => {
            if (error) {
                  console.log(error);
            } else {
                  res.render('pages/index.ejs', {loggedUser: false, loggedAdmin: false, username: username})
            }
      })
})


//------------------------------SOCKETS-----------------------------//
//Importaciones
let MensajesDaoArchivo = require("./src/daos/mensajes/MensajesDaoArchivo")
let dbMensajes = new MensajesDaoArchivo();
let ProductosDaoSql = require("./src/daos/productos/ProductosDaoSql");
let dbProductos = new ProductosDaoSql();
//Mensajes normalizados
const {listarMensajesNormalizados} = require('./normalizacion/normalizacionMensajes')
//


io.on('connection', async (socket) => {
      const mensajes = await listarMensajesNormalizados();
      const productos = await dbProductos.getAll().then((result) => {return result})   
      console.log('Un cliente se ha conectado');
      io.sockets.emit('productos', productos);
      io.sockets.emit('mensajes', mensajes);
      socket.on('new-message', async data => {
            const user = await dbUsers.getByName(data.username)
            dbMensajes.save(data.texto, user);
            io.sockets.emit('mensajes', mensajes);
      });
      socket.on('new-product', async data => {
            await dbProductos.save(data);
            io.sockets.emit('productos', productos);
      });
})

