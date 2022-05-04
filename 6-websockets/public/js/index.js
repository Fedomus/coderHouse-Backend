const socket = io.connect();

function addMessage(e) {
      const mensaje = {
            email: document.getElementById('email').value,
            texto: document.getElementById('texto').value
      };
      socket.emit('new-message', mensaje);
      return false;
}

function addProduct(e) {
      const producto = {
            nombre: document.getElementById('nombre').value,
            precio: document.getElementById('precio').value,
            thumbnail: document.getElementById('urlImg').value
      }
      socket.emit('new-product', producto);
      return false;
}

socket.on('mensajes', data => { 
      renderMensajes(data);
});

socket.on('productos', data => {
      renderProductos(data)
});

function renderMensajes(data) {
      const html = data.map((elem, index) => {
            return(`<p>
            <strong>${elem.email} [${elem.fecha}]</strong>:
            <em>${elem.texto}</em></p>` )
      }).join(" ");
      document.getElementById('mensajes').innerHTML = html;
}

function renderProductos(data) {
      if (data){
            const html = data.map(element => {
            return(`<tr> 
                  <td>${element.nombre}</td>
                  <td>$${element.precio}</td>
                  <td><img src=${element.thumbnail} width="40px" height="40px"></td>
                  </tr>`)
            }).join(" ");            
            document.getElementById('tabla').innerHTML = html;
      } else {
            let html = `<h4>No hay productos</h4>`;
            document.getElementById('tabla').innerHTML = html;
      }
}

