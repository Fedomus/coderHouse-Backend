const ContenedorArchivo = require('../../containers/ContenedorArchivo.js')

class MensajesDaoArchivo extends ContenedorArchivo {

      constructor(){
            super('./src/data/mensajes.json')
      }

      save(texto, user) {
            let mensajes = this.getAll();
            let mensaje = 
            {
                  id: user.email,
                  texto: texto,
                  fecha: new Date().toLocaleString()
            }
            mensajes.push(mensaje);
            this.saveData(mensajes);
            return mensaje;
      }
}

module.exports = MensajesDaoArchivo;