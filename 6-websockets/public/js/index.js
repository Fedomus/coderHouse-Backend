const socket = io.connect();

socket.on('productos', data => {
      renderProductos(data).then( html => document.getElementById('tabla').innerHTML = html)
});

//----------------------------Desnormalizacion de mensajes-----------------------//
const authorSchema = new normalizr.schema.Entity("author", {}, {idAttribute:'id'})
const mensajeSchema = new normalizr.schema.Entity("mensaje", { author: authorSchema }, {idAttribute: 'id'})
const mensajesSchema = new normalizr.schema.Entity("mensajes", { mensaje: [mensajeSchema] }, { idAttribute: 'id' })

socket.on('mensajes', data => { 
      const normalizedMensajesSize = JSON.stringify(data).length
      console.log(data, normalizedMensajesSize);
      const denormalizedMensajes = normalizr.denormalize(data.result, mensajesSchema, data.entities)
      const denormalizedMensajesSize = JSON.stringify(denormalizedMensajes).length
      console.log(denormalizedMensajes, denormalizedMensajesSize);
      let compresion = parseInt((normalizedMensajesSize*100)/denormalizedMensajesSize)
      console.log((`Compresión: ${compresion}%`));
      renderMensajes(denormalizedMensajes, compresion);
});

function renderNavbar(username) {
      
}

async function renderProductos(data) {
      return fetch('templates/tablaProductos.hbs')
            .then(respuesta => respuesta.text())
            .then(plantilla => {
                  const template = Handlebars.compile(plantilla);
                  const html = template({ data })
                  return html
            })
}

function renderMensajes(data, compresion) {
      const html = data.mensajes.map((elem, index) => {
            return(`<p><img src="" style="width:20px;height:20px">
            <strong>${elem.author.email} [${elem.fecha}]</strong>:
            <em>${elem.texto}</em></p>` )
      }).join(" ");
      document.getElementById('mensajes').innerHTML = html;
      document.getElementById('compresion').innerHTML=`Compresion: ${compresion}%`
}

function addMessage(e) {
      const mensaje = {
            email: document.getElementById('email').innerText,
            texto: document.getElementById('texto').value
      };
      socket.emit('new-message', mensaje);
      return false;
}

function addProduct(e) {
      const producto = {
            nombre: document.getElementById('nombre').value,
            precio: document.getElementById('precio').value,
            foto: document.getElementById('urlImg').value
      }
      socket.emit('new-product', producto);
      return false;
}




