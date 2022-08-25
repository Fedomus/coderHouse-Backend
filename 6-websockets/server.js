//-----------------------------CONSTANTS / IMPORTS--------------------------------//
//SERVER
const express = require('express')
const { Server: HttpServer } = require('http')
const { Server: IOServer } = require('socket.io')
const app = express()
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)
const env = require('./src/config/globals')
//Sesion
const session = require('express-session');
const cookieParser = require('cookie-parser');
//persistencia por MongoDB
const MongoStore = require('connect-mongo')
const advancedOptions = {useNewUrlParser: true, useUnifiedTopology: true}
//Routes
const test = require('./src/routes/testApi')
const randoms = require('./src/routes/randomsApi')
const routes = require('./src/routes/routes')
//Usuarios
const UsuariosDaoMongo = require('./src/daos/usuarios/UsuariosDaoMongo')
const dbUsers = new UsuariosDaoMongo()
//Sockets
const MensajesDaoArchivo = require("./src/daos/mensajes/MensajesDaoArchivo")
const dbMensajes = new MensajesDaoArchivo();
const ProductosDaoSql = require("./src/daos/productos/ProductosDaoSql");
const dbProductos = new ProductosDaoSql();
const {listarMensajesNormalizados} = require('./src/normalizacion/normalizacionMensajes')
//Global process
const parseArgs = require('minimist');
const options = {p: 8080, m: "dev"}
const args = parseArgs(process.argv.slice(2), options)
const PUERTO = args.p || 8080



//--------------------TEMPLATES---------------------//
app.set('view engine', 'ejs');
app.set('views', './src/views');

//---------------------MIDDLEWARES----------------------//
//JSON BODY
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Carpeta public
app.use(express.static(__dirname + '/public'));
//SESSION
app.use(cookieParser());
app.use(session({
      store: MongoStore.create({
            mongoUrl: env.MONGO_URI,
            mongoOptions: advancedOptions
      }),
      secret: 'mafalda',
      resave: false, 
      saveUninitialized: false,
      cookie: {
            maxAge: parseInt(env.TIEMPO_EXPIRACION)
      }
}))

//RUTAS
app.use("/test", test);

//---------------------------------------ENDPOINTS---------------------------------------------//
//INDEX
app.get('/', routes.getRoot)

//SIGNUP
app.get('/signup', routes.getSignup)
app.post('/signup', routes.checkUser, routes.postSignup);
app.get('/failsignup', routes.getFailsignup);

//LOGIN
app.post('/login', routes.checkAuthentication, routes.postLogin);
app.get('/faillogin', routes.getFailLogin);

//LOGOUT
app.get('/logout', routes.getLogout);

// info
app.get('/info', routes.getInfo)
//randoms
app.get('/api/randoms', randoms.getRandoms)

//  FAIL ROUTE
app.get('*', routes.failRoute);


//------------------------------SOCKETS-----------------------------//
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



//----------------Se inicia el servidor---------------------//
httpServer.listen(PUERTO, function() {
      console.log(`Servidor corriendo en puerto ${PUERTO}`);
});
httpServer.on('error', error => console.log(`Error en el servidor ${error}`))



