fetch('http://localhost:8080/api/productos-test')
.then((data) => data.json())
.then( async data => document.getElementById('tabla').innerHTML = await renderProductosMocks(data))
.catch((err) => console.log(err));


async function renderProductosMocks(data) {
      return fetch('./templates/tablaProductos.hbs')
            .then(respuesta => respuesta.text())
            .then(plantilla => {
                  const template = Handlebars.compile(plantilla);
                  const html = template({ data })
                  return html
      })
}