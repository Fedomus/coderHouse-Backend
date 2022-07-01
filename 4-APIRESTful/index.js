const multer = require('multer')
const express = require('express');
const { Router } = express;
const router = Router();
const app = express();

//middlewares

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(express.static('public'));

app.use('/api/productos', router)

//-------se importa la clase contenedor y se la instancia con el archivo de productos--------//
let Contenedor = require("./contenedor.js")
let producto = new Contenedor('productos.json')



router.get('/', async (req, resp) => {
  let productos = await producto.getAll();
  resp.json(productos)
})


router.get('/:id', async (req, res) => {
  let id = parseInt(req.params.id)
  let productoElegido = await producto.getById(id);
  res.json(productoElegido);
})


var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/img");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.fieldname + '-' + req.body.nombre);
  },
});

var upload = multer({ storage: storage });

router.post('/', upload.single("thumbnail"), async (req, res) => {
  let productoAgregado = {};
  const file = req.file;
  productoAgregado.nombre = req.body.nombre;
  productoAgregado.precio = req.body.precio;
  productoAgregado.thumbnail = file.filename;
  await producto.save(productoAgregado);
  res.send('Producto agregado: ' + productoAgregado);
})


router.put('/:id', async (req, res) => {
  let id = parseInt(req.params.id);
  let productoElegido = await producto.getById(id);
  await producto.updateById(req.body.nombre, req.body.precio, req.body.thumbnail, id)
  res.json({
    productoAnterior : productoElegido,
    nuevoProducto : await producto.getById(id)
  })
})


router.delete('/:id', async (req, res) => {
  let id = parseInt(req.params.id);
  await producto.deleteById(id)
  res.send('Producto eliminado')
})


const port = 8080;
const server = app.listen(port, () => {
  console.info(`Servidor escuchando en puerto: ${port}`);
});

server.on('Error', error => console.log('Se tiene el siguiente error: ' + error));