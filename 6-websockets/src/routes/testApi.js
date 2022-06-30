const express = require('express')
const { Router } = express
const test = Router()
const apiProductosMock = require('../api/productos')
const apiProductos = new apiProductosMock();

//----------------MOCK API ROUTES---------------------//
test.get('/productos', async (req, res) => { 
      try {
            res.json(await apiProductos.generarProductos())
      } catch (error) {
            next(error);
      }
})
test.get('/', (req, res) => {
      res.render('pages/test.ejs', {productos: apiProductos})
})

module.exports = test