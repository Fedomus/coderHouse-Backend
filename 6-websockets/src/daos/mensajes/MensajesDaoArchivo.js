const ContenedorMongo = require('../../containers/ContenedorArchivo.js')

class MensajesDaoMongo extends ContenedorMongo {

      constructor(){
            super('./src/data/mensajes.json')
      }

      save(data) {
            let mensajes = this.getAll();
            let mensaje = 
            {
                  id: "mensjaes",
                  author: {
                        id: data.email,
                        nombre: data.nombre,
                        apellido: data.apellido,
                        edad: data.edad,
                        alias: data.alias,
                        avatar: data.avatar,
                  },
                  texto: data.texto
            }
            mensajes.push(mensaje);
            this.saveData(mensajes);
            return mensaje;
      }
      
}

module.exports = MensajesDaoMongo;