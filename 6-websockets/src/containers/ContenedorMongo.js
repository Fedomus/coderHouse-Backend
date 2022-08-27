const {MONGO_URI} = require('../config/globals.js')
const mongoose =  require('mongoose')


class ContainerMongo {

      constructor(model) {
            this.model = model;
      }

      async getAll(){
            return await this.model.find({})
      }

      async getById(id) {
            return await this.model.find({id: id})
      }

      async deleteById(id) {
            return await this.model.deleteOne({id: id})
      }

      async updateById(id, elem) {
            return await this.model.updateOne({id: id}, { $set: {elem}})
      }

}

module.exports = ContainerMongo