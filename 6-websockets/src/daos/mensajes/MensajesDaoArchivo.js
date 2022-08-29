const ContenedorArchivo = require('../../containers/ContenedorArchivo.js')
const env = require('../../config/globals')
const log4js = require('../../../logger')
let logger;
if (env.NODE_ENV == 'production'){
      logger = log4js.getLogger('error')
} else {
      logger = log4js.getLogger('consola')
}

class MensajesDaoArchivo extends ContenedorArchivo {

      constructor(){
            super('./src/data/mensajes.json')
      }

      async save(texto, user) {
            try{
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
            } catch(error){
                  logger.error('Error al guardar el mensaje. ' + error)
            }
            
      }
}

module.exports = MensajesDaoArchivo;