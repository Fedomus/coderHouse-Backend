const { FILE_PATH } = require('../src/config/globals')

const knexMensajes = require('knex')({
      client: 'sqlite3',
      connection: { 
            filename: FILE_PATH
      },
      useNullAsDefault: true
})

module.exports = { knexMensajes };