const express = require('express');


const app = express();

const PORT = 8080;

const server = app.listen(PORT, () => {
      console.log("Aplicacion express escuchando en el puerto " + server.address().port);
});

server.on('Error', error => console.log('Se tiene el siguiente error: ' + error));


//-------se importa la clase contenedor y se la instancia con el archivo de productos--------//
let Contenedor = require("./contenedor.js")
let producto = new Contenedor('productos.json')


app.get('/productos', async (req, resp) => {
      let productos = await producto.getAll();
      console.log(productos);
      resp.send(productos)
})

app.get('/productoRandom', async (req, resp) => {
      let productos = await producto.getAll();
      let index = getRandomInt(0, productos.length)
      resp.send(productos[index])
})

function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
    }