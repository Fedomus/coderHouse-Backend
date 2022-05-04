//---------------Importaciones-------------------//
const express = require('express')
const ejs = require('ejs')
const moment = require('moment')
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
let Contenedor = require("./contenedor.js");
let Mensajes = require("./mensajes");
let producto = new Contenedor('productos.json')
let mensaje = new Mensajes('mensajes.json')

app.get('/', (req, res) => {
      res.render('partials/chat');
});

httpServer.listen(8080, function() {
      console.log('Servidor corriendo en http://localhost:8080');
});

io.on('connection', async function(socket) {
      const productos = await producto.getAll();
      const mensajes = await mensaje.getAll();
      console.log('Un cliente se ha conectado');
      io.sockets.emit('mensajes', mensajes);
      io.sockets.emit('productos', productos);
      socket.on('new-message', async data => {
            await mensaje.save(data);
            io.sockets.emit('mensajes', mensajes);
      });
      socket.on('new-product', async data => {
            await producto.save(data);
            io.sockets.emit('productos', productos);
      });
});