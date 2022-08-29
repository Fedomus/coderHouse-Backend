const fs = require('fs');
const logger = require('../../logger')

class ContainerArchivo{

      constructor(filePath){
            this.filePath = filePath;
      }
      
      async saveData(data) {
            fs.writeFileSync(this.filePath, JSON.stringify(data, null, '\t'));
      }

      async getData() {
            let content = [];
            try {
                  let file = fs.readFileSync(this.filePath, 'utf-8');
                  content = JSON.parse(file);
            } 
            catch (error) {
                  this.saveData(content);
                  logger.info(`Creacion del archivo ${this.filePath}`);
            }
            return content;
      }

      async getAll() {
            let data = this.getData();
            return data;
      }

      async getById(id){
            let data = this.getAll();
            let elem = data.find( e => e.id == id) || null;
            if (elem){
                  return elem;
            } else {
                  logger.info('No se encontro elemento con ese ID');
            }
      }

      async deleteById(id){
            let data = this.getAll();
            let elem = this.getById(id);
            if (elem) {
                  let indice = data.indexOf(elem);
                  data.splice(indice, 1);
                  this.saveData(data);
            } else {
                  logger.info('No se encontro carrito con ese ID');
            }
      }

      async updateById(id, elem){
            let data = this.getAll();
            let elemAnterior = this.getById(id);
            let indice = data.indexOf(elemAnterior)
            data.splice(indice, 1, elem)
            this.saveData(data)
            return elem;
      }

}



module.exports = ContainerArchivo;

