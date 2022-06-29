const listarMensajesNormalizados = require('../normalizacion/normalizacionMensajes')
let ProductosDaoSql = require("../src/daos/productos/ProductosDaoSql");
let dbProductos = new ProductosDaoSql();

async function socketsDesdeElServidor(socket) {
      const productos = await dbProductos.getAll().then((result) => {return result})
      console.log('Un cliente se ha conectado');
      io.sockets.emit('productos', productos);
      io.sockets.emit('mensajes', await listarMensajesNormalizados());
      socket.on('new-message', async data => {
            await dbMensajes.save(data);
            io.sockets.emit('mensajes', await listarMensajesNormalizados());
      });
      socket.on('new-product', async data => {
            await dbProductos.save(data);
            io.sockets.emit('productos', productos);
      })
}

module.exports = {socketsDesdeElServidor}