const {generarProducto} = require('../utils/generadorProductos')
const {generarId} = require('../utils/generadorIds')

class ApiProductosMock {
        constructor() {
            
        }
    
        generarProductos() {
            const nuevosProductos = [];
    
            for (let index = 0; index < 5; index++) {
                const nuevoProducto = generarProducto(generarId());
                nuevosProductos.push(nuevoProducto);
            }
            return nuevosProductos;
        }
    }
    

module.exports = ApiProductosMock;