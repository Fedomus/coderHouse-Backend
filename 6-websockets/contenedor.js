const fs = require('fs');

class Contenedor{
      constructor(nombreArchivo){
            this.nombreArchivo = nombreArchivo;
      }
      
      async save(producto) {
            try {
                  if (fs.existsSync(`./${this.nombreArchivo}`)) {
                        const data = await fs.promises.readFile(`./${this.nombreArchivo}`, 'utf-8');
                        let products = JSON.parse(data);
                        let ultimo = products[products.length-1];
                        producto.id = ultimo.id+1;
                        products.push(producto)
                        fs.writeFileSync(`./${this.nombreArchivo}`, JSON.stringify(products, null, 2));
                  } else {
                        producto.id = 1;
                        let newArray = [];
                        newArray.push(producto);
                        fs.writeFileSync(`./${this.nombreArchivo}`, JSON.stringify(newArray, null, 2));
                  }  
            }
            catch (err){
                  console.log(err);
            }
      }

      async getById(id) {
            try {
                  const data = await fs.promises.readFile(`./${this.nombreArchivo}`, 'utf-8');
                  let products = JSON.parse(data)
                  let producto = products.find (p => p.id == id) || null;
                  return producto
            }
            catch {
                  console.log('No se encontro el archivo o no existe producto cono ese ID');
            }
      }

      async getAll() {
            try {
                  const data = await fs.promises.readFile(`./${this.nombreArchivo}`, 'utf-8');
                  let products = JSON.parse(data)
                  return products
            }  
            catch {
                  console.log('No se encontro el archivo');
            }
      }

      async deleteById(id) {
            try {
                  const data = await fs.promises.readFile(`./${this.nombreArchivo}`, 'utf-8');
                  let products = JSON.parse(data)
                  let producto = products.find (p => p.id == id) || '';
                  if (producto != '') {
                        let indice = products.indexOf(producto)
                        products.splice(indice, 1);
                        fs.writeFileSync(`./${this.nombreArchivo}`, JSON.stringify(products, null, 2));
                        console.log('Se ha eliminado el producto de ID '+id);
                  } else{
                        console.log("No existe un producto con ese ID");
                  }
            }
            catch {
                  console.log('No se encontro el archivo');
            }
      }

      async deleteAll() {
            const data = await fs.promises.readFile(`./${this.nombreArchivo}`, 'utf-8');
            let products = JSON.parse(data)
            products = [];
            fs.writeFileSync(this.nombreArchivo, JSON.stringify(products));
      }

      async updateById(nombre, precio, thumbnail, id) {
            try {
                  const data = await fs.promises.readFile(`./${this.nombreArchivo}`, 'utf-8');
                  let products = JSON.parse(data)
                  let producto = products.find (p => p.id == id) || '';
                  if (producto != '') {
                        producto.nombre = nombre || producto.nombre;
                        producto.precio = precio || producto.precio;
                        producto.thumbnail = thumbnail || producto.thumbnail;
                        let indice = products.indexOf(producto)
                        products.slice(indice, 1, producto)
                        fs.writeFileSync(`./${this.nombreArchivo}`, JSON.stringify(products, null, 2));
                  } else {
                        console.log('No existe un producto con ese ID');
                  }
            }
            catch {
                  console.log('No se encontro el archivo');
            }
      }
}

module.exports = Contenedor;