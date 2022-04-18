const express = require('express');
const app = express();
const handlebars = require('express-handlebars')

app.engine(
      "hbs",
      handlebars.engine({
            extname : ".hbs",
            defaultLayout : "index.hbs",
            layoutsDir : __dirname + "/views/layouts",
            partialsDir : __dirname + "/views/partials"
      })
)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.set('view engine', "hbs");
app.set('views', "./views");
// app.use(express.static("public"))

//-------se importa la clase contenedor y se la instancia con el archivo de productos--------//
let Contenedor = require("./contenedor.js")
let producto = new Contenedor('productos.json')

app.get('/', (req, res) => {
      res.render('main')
})

app.post('/productos', async (req, res) => {
      let productoAgregado = {};
      productoAgregado.nombre = req.body.nombre;
      productoAgregado.precio = req.body.precio;
      productoAgregado.thumbnail = req.body.urlImg;
      await producto.save(productoAgregado);
      res.render('main')
    })

app.get('/productos', async (req, resp) => {
      let productos = await producto.getAll();
      resp.render('productos', {productos: productos});
})


const PORT = 8080;
const server = app.listen(PORT, err => {
      if (err) throw new Error(`Error en servidor ${err}`);
      console.log(`Aplicación escuchando en el puerto ${PORT}`);
})


