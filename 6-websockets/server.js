//-----------------------------CONSTANTS / IMPORTS--------------------------------//
//SERVER
const express = require('express')
const { Server: HttpServer } = require('http')
const { Server: IOServer } = require('socket.io')
const app = express()
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)

//Sesion
const session = require('express-session');
const cookieParser = require('cookie-parser');
//persistencia por MongoDB
const MongoStore = require('connect-mongo')
const advancedOptions = {useNewUrlParser: true, useUnifiedTopology: true}
//Routes
const test = require('./src/routes/testApi')
const randoms = require('./src/routes/randomsApi')
const auth = require('./src/routes/auth')
const info = require('./src/routes/info')
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
const env = require('./src/config/globals')
const parseArgs = require('minimist');
const options = {
      alias: {
          "p": "port",
          "m": "modo"
      },
      default: {
          "port": 8080,
          "modo": "cluster"
      }
  };
const args = parseArgs(process.argv.slice(2), options)
const PUERTO = args.p
const MODO = args.m
const modoCluster = MODO == 'cluster'
const numCPUs = require('os').cpus().length
// cluster
const cluster = require('cluster')
//Middlewwares
const compression = require('compression')
//logger
const log4js = require('./logger')
let logger;
if (env.NODE_ENV == 'production'){
      logger = log4js.getLogger('warn')
} else {
      logger = log4js.getLogger()
}

//----------------Se inicia el servidor en modo fork o cluster---------------------//

if (modoCluster && cluster.isPrimary){
      logger.info(`Número de procesadores: ${numCPUs}`);
      logger.info(`PID Máster: ${process.pid}`);
      for (let i = 0; i < numCPUs; i++) {
            cluster.fork()
      }
      cluster.on('exit', worker => {
            logger.info(`Worker ${worker.process.pid} died ${new Date().toLocaleString()}`);
            cluster.fork()
      })
} else {
      httpServer.listen(PUERTO, (err) => {
            if (!err) logger.info(`PID Worker ${process.pid}. Servidor escuchando en puerto ${PUERTO}`);
      });
      httpServer.on('error', error => logger.error(`Error en el servidor ${error}`))
}

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
//compresion GZIP
app.use(compression())

//Loggeo de ruta y metodo de todas las peticiones hechas al servidor
app.use((req, res, next) => {
      logger.info(`${req.originalUrl}, ${req.method}, ${new Date().toLocaleString()}`)
      next()
})

//RUTAS
app.use("/test", test);

//---------------------------------------ENDPOINTS---------------------------------------------//
//AUTH
app.get('/', auth.getRoot)


app.get('/signup', auth.getSignup)
app.post('/signup', auth.checkUser, auth.postSignup);
app.get('/failsignup', auth.getFailsignup);


app.post('/login', auth.checkAuthentication, auth.postLogin);
app.get('/faillogin', auth.getFailLogin);


app.get('/logout', auth.getLogout);

// info
app.get('/info', info.getInfo)

//randoms (Child process)
app.get('/api/randoms', randoms.getRandoms)

//  FAIL ROUTE
app.get('*', (req, res, next) => {
      logger.warn(`${req.url}, ${req.method}, ${new Date().toLocaleString()}`)
}, auth.failRoute);


//------------------------------SOCKETS-----------------------------//
io.on('connection', async (socket) => {
      const mensajes = await listarMensajesNormalizados();
      const productos = await dbProductos.getAll().then((result) => {return result})  
      logger.info('Nuevo cliente conectado') 
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
});








            





