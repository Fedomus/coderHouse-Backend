const logger = require('../../logger')

class ContenedorSql{

      constructor(knex, tabla){
            this.knex = knex;
            this.tabla = tabla;
      }

      async save(elem) {
            await this.knex(this.tabla).insert(elem)
            .then(() => logger.info('Elemento guardado'))
      }

      async getAll() {
            const data = await this.knex(this.tabla).select('*')
            .then( (result) => {
                  return result
            }).catch((err) => {
                  logger.warn(err);
            });
            return data;
      }

      async getById(id) {
            await this.knex(this.tabla)
            .where({ id: id })
            .then( (elem) => {
                  return elem;
            })
            .catch( (err) => {logger.error(err);})
      }

      async deleteById(id) {
            await this.knex(this.tabla)
            .where({id: id})
            .del()
            .then(() => logger.info('Elemento eliminado'))
            .catch((err) => logger.error(err));
      }

      async deleteAll() {
            await this.knex(this.tabla).del()
            .then(() => logger.info('Se eliminaron todos los registros'))
      }

}

module.exports = ContenedorSql;