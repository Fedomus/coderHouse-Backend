const log4js = require('log4js')
const env = require('./src/config/globals')

log4js.configure({
      appenders: {
            myLoggerConsole: {type: 'console'},
            myLoggerFile: {type: 'file', filename: './src/log/logger.log'},
            myLoggerFile2: {type: 'file', filename: './src/log/logger2.log'},
      },
      categories: {
            default: {appenders: ['myLoggerConsole'], level: 'trace'},
            consola: {appenders: ['myLoggerConsole'], level: 'debug'},
            archivo: {appenders: ['myLoggerFile'], level: 'warn'},
            archivo2: {appenders: ['myLoggerFile2'], level: 'info'},
            todos: {appenders: ['myLoggerConsole', 'myLoggerFile', 'myLoggerFile2'], level:'error'}
      }
})
  
let logger;
if (env.NODE_ENV == 'production'){
      logger = log4js.getLogger('archivo')
} else {
      logger = log4js.getLogger('consola')
}
  
module.exports = logger