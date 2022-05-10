const {knexMensajes} = require('./options/sqlite3.js')

class ContenedorMensajes{
      constructor(knex, tabla){
            this.knex = knex;
            this.tabla = tabla;
      }

      async createTable(){
            await this.knex.schema.createTable(this.tabla, (table) => {
                  table.increments('id')
                  table.string('email') 
                  table.string('texto') 
                  table.timestamp('fecha').defaultTo(this.knex.fn.now())
            })
            .then( () => { console.log('Tabla creada');
            })
            .catch( (err) => {console.log(err); throw err });
      }
      
      async save(mensaje) {
            await this.knex(this.tabla).insert(mensaje)
            .then(() => console.log('Mensaje guardado'))
      }
}

let dbMensajes = new ContenedorMensajes(knexMensajes, 'mensajes');




