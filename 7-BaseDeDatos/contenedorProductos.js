const {knexProductos} = require('./options/mariadb.js')

class ContenedorProductos{
      constructor(knex, tabla){
            this.knex = knex;
            this.tabla = tabla;
      }

      async createTable(){
            await this.knex.schema.withSchema('ecommerce').createTable(this.tabla, table => {
                  table.increments('id').notNullable().primary();
                  table.string('nombre', 15).notNullable();
                  table.float('precio')
                  table.string('foto')
            })
      }
      
      async save(producto) {
            await this.knex(this.tabla).insert(producto)
            .then(() => console.log('Producto guardado'))
      }

      async getById(id) {
            await this.knex(this.tabla)
            .where({ id: id })
            .then( (p) => { 
                  console.log(p); 
                  return p;
            })
            .catch( () => {console.log('No se encontro producto con ese id');})
      }

      async getAll() {
            await this.knex.from(this.tabla).select('*')
            .then( (rows) => {
                  console.log(rows);
                  return rows
            })
      }

      async deleteById(id) {
            await this.knex(this.tabla)
            .where({id: id})
            .del()
            .then(() => console.log('Producto eliminado'))
            .catch(() => console.log('No existe producto cono ese ID'));
      }

      async deleteAll() {
            await this.knex(this.tabla).del()
            .then(() => console.log('Se eliminaron todos los productos'))
      }

      async updateById(nombre, precio, foto, id) {
            await this.knex(this.tabla)
            .where({id: id})
            .update({nombre: nombre, precio: precio, foto: foto})
            .then(() => console.log('Producto actualizado'))
            .catch(()=> console.log('No se encontro producto con ese ID'));
      }
}

let dbProductos = new ContenedorProductos(knexProductos, 'productos');

let producto = {
      nombre: "Guitarra",
      precio: 75000,
      foto: "SDA"
}


dbProductos.getAll()