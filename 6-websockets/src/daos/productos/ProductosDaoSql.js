const ContenedorSql = require('../../containers/ContenedorSql')
const {knexProductos} = require('../../../options/mariadb.js');
const env = require('../../config/globals')
const log4js = require('../../../logger')
let logger;
if (env.NODE_ENV == 'production'){
      logger = log4js.getLogger('error')
} else {
      logger = log4js.getLogger('consola')
}

class ProductosDaoSql extends ContenedorSql {

      constructor(){
            super(knexProductos, 'productos')
      }

      async createTable(){
            try{ 
                  await this.knex.schema.withSchema('ecommerce').createTable(this.tabla, table => {
                        table.increments('id').notNullable().primary();
                        table.string('nombre', 15).notNullable();
                        table.float('precio')
                        table.string('foto')
                  })
            } catch (error){
                  logger.error('Error en la creación de la tabla. ' + error)
            }
            
      }
      
      async updateById(nombre, precio, foto, id) {
            try {
                  await this.knex(this.tabla)
                  .where({id: id})
                  .update({nombre: nombre, precio: precio, foto: foto})
                  .then(() => logger.info('Producto actualizado'))
                  .catch(()=> logger.info('No se encontro producto con ese ID'));
            } catch(error){
                  logger.error('Error en el update by id. ' + error)
            }
            
      }

}


module.exports = ProductosDaoSql
