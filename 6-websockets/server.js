//---------------Importaciones-------------------//
const express = require('express')
const { Server: HttpServer } = require('http')
const { Server: IOServer } = require('socket.io')
const { schema, normalize, denormalize } = require('normalizr')
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

app.get('/api/productos-test', async (req, res) => {
      try {
            res.json(await apiProductos.generarProductos())
      } catch (error) {
            next(error);
      }
})

app.get('/test', (req, res) => {
      res.sendFile(__dirname + '/public/tabla.html')
})


httpServer.listen(8080, function() {
      console.log('Servidor corriendo en http://localhost:8080');
});




io.on('connection', async function(socket) {
      const mensajes = dbMensajes.getAll()

      //----------------------Normalizacion de mensajes---------------------//
      const authorSchema = new schema.Entity("author", {}, {
            idAttribute: 'email'
      })
      const mensajeSchema = new schema.Entity("mensajes", {
            author: authorSchema
      })
      const normalizedMensajes = normalize(mensajes, mensajeSchema)

      const productos = await dbProductos.getAll().then((result) => {return result})
      console.log('Un cliente se ha conectado');
      io.sockets.emit('productos', productos);
      io.sockets.emit('mensajes', normalizedMensajes);

      console.log(util.inspect(normalizedMensajes, false, 12, true));

      socket.on('new-message', async data => {
            await dbMensajes.save(data);
            io.sockets.emit('mensajes', normalizedMensajes);
      });
      socket.on('new-product', async data => {
            await dbProductos.save(data);
            io.sockets.emit('productos', productos);
      });
});