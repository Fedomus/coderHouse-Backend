const socket = io.connect();

socket.on('productos', data => {
      renderProductos(data).then( html => document.getElementById('tabla').innerHTML = html)
});

//----------------------------Desnormalizacion de mensajes-----------------------//
const authorSchema = new schema.Entity("author", {}, {
      idAttribute: 'email'
})
const mensajeSchema = new schema.Entity("mensajes", {
      author: authorSchema
})

socket.on('mensajes', data => { 
      const denormalizedMensajes = denormalize(data.result, mensajeSchema, data.entities)
      renderMensajes(denormalizedMensajes);
});


async function renderProductos(data) {
      return fetch('templates/tablaProductos.hbs')
            .then(respuesta => respuesta.text())
            .then(plantilla => {
                  const template = Handlebars.compile(plantilla);
                  const html = template({ data })
                  return html
            })
}

function renderMensajes(data) {
      const html = data.map((elem, index) => {
            return(`<p>
            <strong>${elem.email} [${elem.fecha}]</strong>:
            <em>${elem.texto}</em></p>` )
      }).join(" ");
      document.getElementById('mensajes').innerHTML = html;
}

function addMessage(e) {
      const mensaje = {
            email: document.getElementById('email').value,
            nombre: document.getElementById('nombre').value,
            apellido: document.getElementById('apellido').value,
            edad: document.getElementById('edad').value,
            alias: document.getElementById('alias').value,
            avatar: document.getElementById('avatar').value,
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


