const mongoose = require('mongoose')
const express = require('express')
const bodyParser = require('body-parser')
const { router } = require('bull-board')
const consola = require('consola')

const rootRoute = require('./route')

const app = express()

mongoose.Promise = global.Promise

mongoose.connect('mongodb://localhost:27017/express', {
	minPoolSize: 1,
	maxPoolSize: 20,
	compression: { compressors: ['zlib'] },
	useUnifiedTopology: true,
	useNewUrlParser: true,
	useFindAndModify: false,
	socketTimeoutMS: 60000,
	serverSelectionTimeoutMS: 60000,
	loggerLevel: 'error'
})

mongoose.connection.on('connecting', () => consola.info('database connecting'))
mongoose.connection.on('connected', () => consola.success('database connected'))
mongoose.connection.on('disconnecting', () => consola.info('database disconnecting'))
mongoose.connection.on('disconnected', () => consola.info('database disconnected'))
mongoose.connection.on('error', () => consola.error('database error'))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use('/dashboard', router)

app.use(rootRoute)

app.listen(process.env.PORT || 3000, () => consola.info('server is running'))
