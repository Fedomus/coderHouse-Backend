const env = require('../config/globals')
const log4js = require('../../logger')
let logger;
if (env.NODE_ENV == 'production'){
      logger = log4js.getLogger('error')
} else {
      logger = log4js.getLogger('consola')
}

class ContenedorSql{

      constructor(knex, tabla){
            this.knex = knex;
            this.tabla = tabla;
      }

      async save(elem) {
            await this.knex(this.tabla).insert(elem)
            .then(() => logger.info('Elemento guardado'))
            .catch( error => logger.error('Error al intentar guardar un nuevo producto en la DB. ' + error))
      }

      async getAll() {
            const data = await this.knex(this.tabla).select('*')
            .then( (result) => {
                  return result
            }).catch((err) => {
                  logger.error('Error al intentar obtener todos los productos de la DB. ' + err);
            });
            return data;
      }

      async getById(id) {
            await this.knex(this.tabla)
            .where({ id: id })
            .then( (elem) => {
                  return elem;
            })
            .catch( (err) => {logger.error('Error al intentar el get by id. ' + err);})
      }

      async deleteById(id) {
            await this.knex(this.tabla)
            .where({id: id})
            .del()
            .then(() => logger.info('Elemento eliminado'))
            .catch((err) => logger.error('Error al intentar el delete by id. ' + err));
      }

      async deleteAll() {
            await this.knex(this.tabla).del()
            .then(() => logger.info('Se eliminaron todos los registros'))
            .catch((error) => { 
                  logger.error('Error al intentar borrar todos los productos. ' + error)
            })
      }

}

module.exports = ContenedorSql;