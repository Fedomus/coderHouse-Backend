const ContenedorSql = require('../../containers/ContenedorSql')
const {knexProductos} = require('../../../options/mariadb.js');
const logger = require('../../../logger')

class ProductosDaoSql extends ContenedorSql {

      constructor(){
            super(knexProductos, 'productos')
      }

      async createTable(){
            await this.knex.schema.withSchema('ecommerce').createTable(this.tabla, table => {
                  table.increments('id').notNullable().primary();
                  table.string('nombre', 15).notNullable();
                  table.float('precio')
                  table.string('foto')
            })
      }
      
      async updateById(nombre, precio, foto, id) {
            await this.knex(this.tabla)
            .where({id: id})
            .update({nombre: nombre, precio: precio, foto: foto})
            .then(() => logger.info('Producto actualizado'))
            .catch(()=> logger.info('No se encontro producto con ese ID'));
      }

}


module.exports = ProductosDaoSql
