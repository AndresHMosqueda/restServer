
const express = require('express')
const app = express()

app.use(require('./usuarios'))
app.use(require('./login'))
app.use(require('./categoria'))
app.use(require('./producto'))
app.use(require('./upload'))

module.exports = app;
