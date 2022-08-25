const fork = require('child_process').fork
const child = fork('./calculoAleatorio.js')

async function getRandoms(req, res){
      const cant = req.query.cant || 100000000;
    
      child.on('message', (resultado) => {
          res.json(resultado);
      })
      child.send(cant);

}

module.exports = {getRandoms}