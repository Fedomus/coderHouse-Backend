const fs = require('fs')


class ContainerArchivo{

      constructor(filePath){
            this.filePath = filePath;
      }
      
      saveData(data) {
            fs.writeFileSync(this.filePath, JSON.stringify(data, null, '\t'));
      }

      getData() {
            let content = [];
            try {
                  let file = fs.readFileSync(this.filePath, 'utf-8');
                  content = JSON.parse(file);
            } 
            catch (error) {
                  this.saveData(content);
                  console.log(`Creacion del archivo ${this.filePath}`);
            }
            return content;
      }

      getAll() {
            let data = this.getData();
            return data;
      }

      getById(id){
            let data = this.getAll();
            let elem = data.find( e => e.id == id) || null;
            if (elem){
                  return elem;
            } else {
                  console.log('No se encontro elemento con ese ID');
            }
      }

      getByName(name){
            let data = this.getAll();
            let elem = data.find( e => e.name == name) || null;
            if (elem){
                  return elem;
            } else {
                  console.log('No se encontro ese nombre');
            }
      }

      deleteById(id){
            let data = this.getAll();
            let elem = this.getById(id);
            if (elem) {
                  let indice = data.indexOf(elem);
                  data.splice(indice, 1);
                  this.saveData(data);
            } else {
                  console.log('No se encontro carrito con ese ID');
            }
      }

      updateById(id, elem){
            let data = this.getAll();
            let elemAnterior = this.getById(id);
            let indice = data.indexOf(elemAnterior)
            data.splice(indice, 1, elem)
            this.saveData(data)
            return elem;
      }

}



module.exports = ContainerArchivo;

