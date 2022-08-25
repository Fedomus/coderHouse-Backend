const { HOST, USER, PASS, DB } = require('../src/config/globals.js')

const knexProductos = require('knex')({
      client: 'mysql',
      connection: {
            host: HOST,
            user: USER,
            password: PASS,
            database: DB
      },
      pool: {min: 0, max: 10}
})

module.exports = { knexProductos };