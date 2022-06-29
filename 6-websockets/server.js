//--------------------Servidor express-----------------//
const express = require('express')
const { Server: HttpServer } = require('http')
const { Server: IOServer } = require('socket.io')
const session = require('express-session')
const cookieParser = require('cookie-parser')

//----------------Se inicializa la aplicación----------------//
const app = express()
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)
const port = process.env.PORT || 8080;

//----------------Se inicia el servidor---------------------//
httpServer.listen(port, function() {
      console.log('Servidor corriendo en http://localhost:8080');
});

//----------------SOCKETS------------------//
let MensajesDaoArchivo = require("./src/daos/mensajes/MensajesDaoArchivo")
let dbMensajes = new MensajesDaoArchivo();
const {listarMensajesNormalizados} = require('./normalizacion/normalizacionMensajes')
let ProductosDaoSql = require("./src/daos/productos/ProductosDaoSql");
let dbProductos = new ProductosDaoSql();

//------------Persistencia sesion por MongoDB------------//
const MongoStore = require('connect-mongo')
const advancedOptions = { useNewUrlParser:true, useUnifiedTopology: true }

//-------------------------------Routers--------------------------//
const test = require('./src/routes/testApi')
const auth = require('./src/routes/authentications');



app.set('view engine', 'ejs');

//----------------Middlewares--------------------//
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

app.get('/', (req, res) => {
      if(req.session.loggedAdmin){
            res.render('pages/index.ejs', {loggedUser: false, loggedAdmin: true, username: req.session.username})
      } else if (req.session.loggedUser){
            res.render('pages/index.ejs', {loggedUser: true, loggedAdmin: false, username: req.session.username})
      } else {
            res.render('pages/index.ejs', {loggedUser: false, loggedAdmin: false, username: null})
      }
})

app.post('/login', (req, res) => {
      const { username, password } = req.body
      if (username == 'admin' && password == 'admin123'){
            req.session.username = username
            req.session.loggedAdmin=true
            req.session.loggedUser=false
            res.redirect('http://localhost:8080/')
      } else if (username == 'fede' && password == 'fede123') {
            req.session.username = username
            req.session.loggedAdmin=false
            req.session.loggedUser = true
            res.redirect('http://localhost:8080/')
      }
})

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

io.on('connection', (socket) => {
      const productos = dbProductos.getAll().then((result) => {return result})
      console.log('Un cliente se ha conectado');
      io.sockets.emit('productos', productos);
      io.sockets.emit('mensajes', listarMensajesNormalizados());
      socket.on('new-message', async data => {
            await dbMensajes.save(data);
            io.sockets.emit('mensajes', listarMensajesNormalizados());
      });
      socket.on('new-product', async data => {
            await dbProductos.save(data);
            io.sockets.emit('productos', productos);
      });
})

