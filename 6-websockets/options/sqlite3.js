const knexMensajes = require('knex')({
      client: 'sqlite3',
      connection: { 
            filename: 'C:/Users/feder/OneDrive/Documentos/Programación/coderHouse/Backend/coderHouse-Backend/6-websockets/src/data/ecommerce.sqlite3' 
      },
      useNullAsDefault: true
})

module.exports = { knexMensajes };