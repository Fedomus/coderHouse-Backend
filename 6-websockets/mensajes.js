const fs = require('fs');
const moment = require('moment')

class Mensajes{
      constructor(nombreArchivo){
            this.nombreArchivo = nombreArchivo;
      }
      
      async save(mensaje) {
            try {
                  if (fs.existsSync(`./${this.nombreArchivo}`)) {
                        const data = await fs.promises.readFile(`./${this.nombreArchivo}`, 'utf-8');
                        let mensajes = JSON.parse(data);
                        mensaje.fecha = moment.format('DD/MM/YYYY HH:MM:SS');
                        mensajes.push(mensaje)
                        fs.writeFileSync(`./${this.nombreArchivo}`, JSON.stringify(mensajes, null, 2));
                  } else {
                        let newArray = [];
                        newArray.push(mensaje);
                        fs.writeFileSync(`./${this.nombreArchivo}`, JSON.stringify(newArray, null, 2));
                  }  
            }
            catch (err){
                  console.log(err);
            }
      }
      async getAll() {
            try {
                  const data = await fs.promises.readFile(`./${this.nombreArchivo}`, 'utf-8');
                  let mensajes = JSON.parse(data)
                  return mensajes
            }  
            catch {
                  console.log('No se encontro el archivo');
            }
      }
}


module.exports = Mensajes;