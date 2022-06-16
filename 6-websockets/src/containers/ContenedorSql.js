class ContenedorSql{

      constructor(knex, tabla){
            this.knex = knex;
            this.tabla = tabla;
      }

      async save(elem) {
            await this.knex(this.tabla).insert(elem)
            .then(() => console.log('Elemento guardado'))
      }

      async getAll() {
            const data = await this.knex(this.tabla).select('*')
            .then( (result) => {
                  return result
            }).catch((err) => {
                  console.log(err);
            });
            return data;
      }

      async getById(id) {
            await this.knex(this.tabla)
            .where({ id: id })
            .then( (elem) => {
                  return elem;
            })
            .catch( () => {console.log('No se encontro elemento con ese id');})
      }

      async deleteById(id) {
            await this.knex(this.tabla)
            .where({id: id})
            .del()
            .then(() => console.log('Elemento eliminado'))
            .catch(() => console.log('No existe elemento cono ese ID'));
      }

      async deleteAll() {
            await this.knex(this.tabla).del()
            .then(() => console.log('Se eliminaron todos los registros'))
      }

}

module.exports = ContenedorSql;