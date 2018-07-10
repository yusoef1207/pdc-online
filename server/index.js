const express = require('express')
const next = require('next') 
const bodyParser = require('body-parser')
const cors = require('cors')
const logger = require('morgan');

const port = parseInt(process.env.PORT, 10) || 4000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

let api = require('./api')

app.prepare()
  .then(() => {
    const server = express()

    server.use(logger('dev'));
    server.use(cors());
    server.use(bodyParser.json());
    server.use(bodyParser.urlencoded({  
      extended: false  
    })); ;
    
    server.post('/login', api.user);
    server.get('/user/:id', api.user);
    server.post('/add_photo', api.user);
    
    server.post('/answer-history', api.program);
    server.post('/answer', api.program);
    server.get('/program', api.program);
    server.get('/question/:id', api.program);

    server.get('/before-start', (req, res) => {
      return handle(req, res)
    })

    server.get('/dashboard', (req, res) => {
      return handle(req, res)
    })

    server.get('/tutorial', (req, res) => {
      return handle(req, res)
    })

    server.get('/', (req, res) => {
      return handle(req, res)
    })

    server.get('/static/**/*', (req, res) => {
      return handle(req, res)
    })

    server.listen(port, (err) => {
      if (err) throw err
      console.log(`> Ready on http://localhost:${port}`)
    })
  })