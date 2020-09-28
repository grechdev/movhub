const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')

//Middlewares
app.use(cors())
app.use('/media', express.static('media'))
app.use(bodyParser.json())

//Import Routes
const moviesRoute = require('./routes/movies')
const usersRoute = require('./routes/users')

app.use('/movies', moviesRoute)
app.use('/users', usersRoute)

app.listen(5000)
