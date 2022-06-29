const { schema, normalize } = require('normalizr')
const util = require('util')
let MensajesDaoArchivo = require("../src/daos/mensajes/MensajesDaoArchivo")
let dbMensajes = new MensajesDaoArchivo();

const authorSchema = new schema.Entity("author", {}, {idAttribute:'id'})
const mensajeSchema = new schema.Entity("mensaje", { author: authorSchema }, {idAttribute: '_id'})
const mensajesSchema = new schema.Entity("mensajes", { mensaje: [mensajeSchema] }, { idAttribute: 'id' })
const normalizarMensajes = (mensajesConId) => normalize(mensajesConId, mensajesSchema)

async function listarMensajesNormalizados() {
      const mensajes = await dbMensajes.getAll()
      const normalizados = normalizarMensajes({ id: 'mensajes', mensajes })
      return normalizados
}

module.exports = {listarMensajesNormalizados};