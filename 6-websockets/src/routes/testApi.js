const express = require('express')
const { Router } = express
const test = Router()
const apiProductosMock = require('../api/productos')
const apiProductos = new apiProductosMock();

//----------------Rutas de mocks api---------------------//
test.get('/api/productos-test', async (req, res) => { 
      try {
            res.json(await apiProductos.generarProductos())
      } catch (error) {
            next(error);
      }
})
test.get('/', (req, res) => {
      res.render('pages/index.ejs', {productos: productos})
})

module.exports = test