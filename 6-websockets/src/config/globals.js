require('dotenv').config()

module.exports = {
  MONGO_URI: process.env.MONGO_URI || '',
  TIEMPO_EXPIRACION: process.env.TIEMPO_EXPIRACION || 3000,
  HOST: process.env.HOST,
  USER: process.env.USER,
  PASS: process.env.PASS,
  DB: process.env.DB,
  FILE_PATH: process.env.FILE_PATH,
  NODE_ENV: process.env.NODE_ENV
}