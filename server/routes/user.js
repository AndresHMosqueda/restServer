const express = require('express')
const app =  express()


app.get('/usuario', function (req, res) {
    res.json('Usuario')
  })
  
  module.exports = app;