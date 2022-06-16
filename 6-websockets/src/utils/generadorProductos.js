let faker = require('faker');
faker.locale = 'es';

function generarProducto(id) {
    return {
        id: id,
        nombre: faker.commerce.productName(),
        precio : faker.commerce.price(1, 5000,2 , '$'),
        website: faker.image.imageUrl(),
    }
}

module.exports = {generarProducto}