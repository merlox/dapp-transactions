const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const path = require('path')
const fs = require('fs')
const ip = 'localhost'
const yargs = require('yargs')
const argv = yargs.option('port', {
    alias: 'p',
    description: 'Set the port to run this server on',
    type: 'number',
}).help().alias('help', 'h').argv
if(!argv.port) {
    console.log('Error, you need to pass the port you want to run this application on with npm start -- -p 8001')
    process.exit(0)
}
const port = argv.port

app.use('/', express.static(path.join(__dirname, 'dist/')))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.use('*', (req, res, next) => {
	// Logger
	let time = new Date()
	console.log(`${req.method} to ${req.originalUrl} at ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`)
	next()
})

app.get('*/build.js', (req, res) => {
   res.sendFile(path.join(__dirname, 'dist', 'build.js'))
})

app.get('*/favicon.png', (req, res) => {
   res.sendFile(path.join(__dirname, 'dist', 'img/favicon.png'))
})

app.get('*', (req, res) => {
   res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

app.listen(port, ip, (req, res) => {
   console.log(`Server listening on ${ip}:${port}`)
})
