const express = require('express');
const PORT = 8080;
const app = express();

// app.set('views', './views');
app.set('view engine', 'ejs');

//-------se importa la clase contenedor y se la instancia con el archivo de productos--------//
let Contenedor = require("./contenedor.js")
let producto = new Contenedor('productos.json')

app.get('/', (req, res) => {
      res.render('pages/main')
})

app.post('/productos', async (req, res) => {
      let productoAgregado = {};
      productoAgregado.nombre = req.body.nombre;
      productoAgregado.precio = req.body.precio;
      productoAgregado.thumbnail = req.body.urlImg;
      await producto.save(productoAgregado);
      res.render('pages/main')
    })

app.get('/productos', async (req, resp) => {
      let productos = await producto.getAll();
      resp.render('pages/productos', {productos: productos});
})



const server = app.listen(PORT, () => {
      console.log("Aplicación escuchando en el puerto " + server.address().port);
});