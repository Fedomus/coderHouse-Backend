const express = require('express');
const app = express();
const pug = require('pug')

app.set('views', './views');
app.set('view engine', 'pug');

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// app.use(express.static("public"))

//-------se importa la clase contenedor y se la instancia con el archivo de productos--------//
let Contenedor = require("./contenedor.js")
let producto = new Contenedor('productos.json')

app.get('/', (req, res) => {
      res.render('main.pug')
})

app.post('/productos', async (req, res) => {
      let productoAgregado = {};
      productoAgregado.nombre = req.body.nombre;
      productoAgregado.precio = req.body.precio;
      productoAgregado.thumbnail = req.body.urlImg;
      await producto.save(productoAgregado);
      res.render('main.pug')
    })

app.get('/productos', async (req, resp) => {
      let productos = await producto.getAll();
      let mensaje = 'No hay productos'
      resp.render('productos.pug', {productos: productos, mensaje : mensaje});
})

const PORT = 8080;
const server = app.listen(PORT, err => {
      if (err) throw new Error(`Error en servidor ${err}`);
      console.log(`Aplicación escuchando en el puerto ${PORT}`);
})
