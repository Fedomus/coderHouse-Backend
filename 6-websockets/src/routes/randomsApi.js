const fork = require('child_process').fork


function getRandoms(req, res){
    const cant = req.query.cant || 100000000; 
    const child = fork('./src/utils/calculoAleatorio.js')
    child.on('message', (resultado) => {
        res.json(resultado);
    })
    child.send(cant);
}

module.exports = {getRandoms}