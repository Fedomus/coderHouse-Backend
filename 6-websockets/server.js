//---------------Importaciones-------------------//
const express = require('express')
const { Server: HttpServer } = require('http')
const { Server: IOServer } = require('socket.io')
const { schema, normalize } = require('normalizr')
const util = require('util')

//----------------Inicializaciones----------------//
const app = express()
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)

//----------------Middlewares--------------------//
// app.set('views', './views');
app.set('view engine', 'ejs');
app.use(express.static('public'));
const apiProductosMock = require('./src/api/productos')
const apiProductos = new apiProductosMock();

//-------Se importa y se instancia clase productosDaoSql y clase mensajesDaoArchivo--------//
let ProductosDaoSql = require("./src/daos/productos/ProductosDaoSql");
let MensajesDaoArchivo = require("./src/daos/mensajes/MensajesDaoArchivo")
let dbProductos = new ProductosDaoSql();
let dbMensajes = new MensajesDaoArchivo();

//----------------Rutas de mocks api---------------------//
app.get('/api/productos-test', async (req, res) => { 
      try {
            res.json(await apiProductos.generarProductos())
      } catch (error) {
            next(error);
      }
})
app.get('/test', (req, res) => {
      res.sendFile(__dirname + '/public/tablaMocks.html')
})


//----------------------Normalizacion de mensajes---------------------//
const authorSchema = new schema.Entity("author", {}, {idAttribute:'id'})
const mensajeSchema = new schema.Entity("mensaje", { author: authorSchema }, {idAttribute: '_id'})
const mensajesSchema = new schema.Entity("mensajes", { mensaje: [mensajeSchema] }, { idAttribute: 'id' })
const normalizarMensajes = (mensajesConId) => normalize(mensajesConId, mensajesSchema)

async function listarMensajesNormalizados() {
      const mensajes = await dbMensajes.getAll()
      const normalizados = normalizarMensajes({ id: 'mensajes', mensajes })
      return normalizados
}



io.on('connection', async function(socket) {
      const productos = await dbProductos.getAll().then((result) => {return result})
      console.log('Un cliente se ha conectado');
      io.sockets.emit('productos', productos);
      io.sockets.emit('mensajes', await listarMensajesNormalizados());

      console.log(util.inspect(await listarMensajesNormalizados(), false, 12, true));

      socket.on('new-message', async data => {
            await dbMensajes.save(data);
            io.sockets.emit('mensajes', await listarMensajesNormalizados());
      });
      socket.on('new-product', async data => {
            await dbProductos.save(data);
            io.sockets.emit('productos', productos);
      });
});

//----------------Server on---------------------//
httpServer.listen(8080, function() {
      console.log('Servidor corriendo en http://localhost:8080');
});