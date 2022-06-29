const express = require('express')
const { Router } = express
const auth = Router()

auth.get('/', (req, res) => {
      res.sendFile(__dirname + '../../public/login.html')
})

auth.post('/', (req, res) => {
      if(req.body.username == 'admin' && req.body.password == 'admin123'){
            session.user = req.body.username
            session.loggedAdmin = true
            session.loggedUser = true
            res.redirect('http://localhost:8080/')
      } 
      if(req.body.username == 'Fede' && req.body.password == 'asd123'){
            session.user = req.body.username
            session.admin = false
            session.logged = true
            res.redirect('http://localhost:8080/')
      }  
})

module.exports = auth