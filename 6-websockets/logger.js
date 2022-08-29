const log4js = require('log4js')

log4js.configure({
      appenders: {
            loggerConsole: {type: 'console'},
            loggerWarn: {type: 'file', filename: './src/log/warn.log'},
            loggerError: {type: 'file', filename: './src/log/error.log'}
      },
      categories: {
            default: {appenders: ['loggerConsole'], level: 'debug'},
            consola: {appenders: ['loggerConsole'], level: 'error'},
            warn: {appenders: ['loggerWarn'], level: 'warn'},
            error: {appenders: ['loggerError'], level: 'error'},
      }
})



module.exports = log4js