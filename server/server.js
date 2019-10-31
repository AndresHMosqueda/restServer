require('./config/config');

const express = require('express')
const mongoose = require('mongoose');


const app = express()
var bodyParser = require('body-parser')
 
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(require('./routes/usuarios'))

mongoose.connect('mongodb://localhost:27017/coffee', (err, res) => { //callback si lo logra hacer 
  if(err) throw err;
  console.log('Base de datos ONLINE')
});


app.listen(process.env.PORT, () => { 
    console.log('Escuchando en el puerto', 3000)
});