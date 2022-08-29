const fs = require('fs');
const env = require('../config/globals')
const log4js = require('../../logger')
let logger;
if (env.NODE_ENV == 'production'){
      logger = log4js.getLogger('error')
} else {
      logger = log4js.getLogger('consola')
}

class ContainerArchivo{

      constructor(filePath){
            this.filePath = filePath;
      }
      
      async saveData(data) {
            try{
                  fs.writeFileSync(this.filePath, JSON.stringify(data, null, '\t'));
            } catch(error){
                  logger.error('Error al intentar guardar los mensajes en archivo. ' + error)
            }     
      }

      async getData() {
            let content = [];
            try {
                  let file = fs.readFileSync(this.filePath, 'utf-8');
                  content = JSON.parse(file);
            } 
            catch (error) {
                  try{ 
                        this.saveData(content);
                        logger.info(`Creacion del archivo ${this.filePath}`);
                  } catch(error){
                        logger.error('Error al intentar crear el archivo de mensajes. ' + error)
                  }
            }
            return content;
      }

      async getAll() {
            try {
                  let data = this.getData();
                  return data;
            } catch(error){
                  logger.error('Error al intentar obtener todos los mensajes. ' + error)
            }
      }

      async getById(id){
            try {
                  let data = this.getAll();
                  let elem = data.find( e => e.id == id) || null;
                  if (elem){
                        return elem;
                  } else {
                        logger.info('No se encontro elemento con ese ID');
                  }
            } catch( error ) {
                  logger.error('Error al intentar obtener un mensaje por id. ' + error)
            }
      }

      async deleteById(id){
            try { 
                  let data = this.getAll();
                  let elem = this.getById(id);
                  if (elem) {
                        let indice = data.indexOf(elem);
                        data.splice(indice, 1);
                        this.saveData(data);
                  } else {
                        logger.info('No se encontro carrito con ese ID');
                  }
            } catch (error) {
                  logger.error('Error al intentar eliminar por id un mensaje. ' + error)
            }
      }

      async updateById(id, elem){
            try{
                  let data = this.getAll();
                  let elemAnterior = this.getById(id);
                  let indice = data.indexOf(elemAnterior)
                  data.splice(indice, 1, elem)
                  this.saveData(data)
                  return elem;
            } catch(error) {
                  logger.error('Error al intentar actualizar datos por id. ' + error)
            } 
      }

}



module.exports = ContainerArchivo;

