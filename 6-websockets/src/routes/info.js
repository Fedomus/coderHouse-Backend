const numCPUs = require('os').cpus().length

async function getInfo(req, res){
      res.render('pages/info.ejs', {
            argumentos: process.argv,
            sistema: process.platform,
            version: process.version,
            memoria: process.memoryUsage().rss,
            path: process.execPath,
            id: process.pid,
            directorio: process.cwd(),
            nucleos: numCPUs
      })
}

module.exports = { getInfo }