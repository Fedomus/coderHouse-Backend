const knexProductos = require('knex')({
      client: 'mysql',
      connection: {
            host: '127.0.0.1',
            user: 'root',
            password: '',
            database: 'ecommerce'
      },
      pool: {min: 0, max: 10}
})

module.exports = { knexProductos };