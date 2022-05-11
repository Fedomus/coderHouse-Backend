//---------------Importaciones-------------------//
const express = require('express')
const { Server: HttpServer } = require('http')
const { Server: IOServer } = require('socket.io')


//----------------Inicializaciones----------------//
const app = express()
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)

//----------------Middlewares--------------------//
// app.set('views', './views');
app.set('view engine', 'ejs');
app.use(express.static('public'));

//-------Se importa y se instancia clase productos y clase mensajes--------//
let {ContenedorProductos} = require("./clases/contenedorProductos.js");
let {ContenedorMensajes} = require("./clases/contenedorMensajes");
const {knexProductos} = require('./options/mariadb.js')
const {knexMensajes} = require('./options/sqlite3.js')
let dbProductos = new ContenedorProductos(knexProductos, 'productos');
let dbMensajes = new ContenedorMensajes(knexMensajes, 'mensajes');

httpServer.listen(8080, function() {
      console.log('Servidor corriendo en http://localhost:8080');
});

io.on('connection', async function(socket) {
      const productos = await dbProductos.getAll().then((result) => {return result})
      const mensajes = await dbMensajes.getAll().then((result) => {return result})
      console.log('Un cliente se ha conectado');
      io.sockets.emit('productos', productos);
      io.sockets.emit('mensajes', mensajes);
      socket.on('new-message', async data => {
            await dbMensajes.save(data);
            io.sockets.emit('mensajes', mensajes);
      });
      socket.on('new-product', async data => {
            await dbProductos.save(data);
            io.sockets.emit('productos', productos);
      });
});