const ContenedorArchivo = require('../../containers/ContenedorArchivo.js')

class MensajesDaoArchivo extends ContenedorArchivo {

      constructor(){
            super('./src/data/mensajes.json')
      }

      save(texto, user) {
            let mensajes = this.getAll();
            let mensaje = 
            {
                  id: "mensajes",
                  author: {
                        id: user.usuario.email,
                        nombre: user.usuario.nombre,
                        apellido: user.usuario.apellido,
                        edad: user.usuario.edad,
                        alias: user.usuario.alias,
                        avatar: user.usuario.avatar,
                  },
                  texto: texto,
                  fecha: new Date().toLocaleString()
            }
            mensajes.push(mensaje);
            this.saveData(mensajes);
            return mensaje;
      }
}

module.exports = MensajesDaoArchivo;