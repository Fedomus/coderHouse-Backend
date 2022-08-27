const mongoose = require('mongoose');
const { MONGO_URI } = require('../config/globals')

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true, 
    useUnifiedTopology: true
  })

const usuariosCollection = 'usuarios';

const UsuarioSchema = new mongoose.Schema({
    email: {type: String, required: true, max: 100},
    password: {type: String, required: true}
})

module.exports = mongoose.model(usuariosCollection, UsuarioSchema)