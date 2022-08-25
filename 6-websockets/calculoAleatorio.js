function aleatorio(min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min)
}

function obtenerNumeros(cant){
      let numeros = [];

      for (let i = 0; i < cant; i++) {
            numeros.push(aleatorio(1, 1000))
      }

      let repetidos = {};

      numeros.forEach( (numero) => {
            repetidos[numero] = (repetidos[numero] || 0) + 1;
      })

      return repetidos
}
  
process.on('message', (cant) => {
      const numbers = obtenerNumeros(cant);
      process.send(numbers);
  })
