const restify = require('restify')
const watchOath = require('./lib/watchOath')
const corsMiddleware = require('restify-cors-middleware')
const subscribe = require('./lib/subscribe')

const server = restify.createServer({
  name: 'email-server',
  version: '0.0.0'
})

const cors = corsMiddleware({
  preflightMaxAge: 5, //Optional
  origins: ['http://localhost:8081', 'https://guildcrypt.com', 'https://guildcrypt-site-qa.herokuapp.com'],
  allowHeaders: ['API-Token'],
  exposeHeaders: ['API-Token-Expiry']
})


server.use(restify.plugins.acceptParser(server.acceptable))
server.use(restify.plugins.queryParser())
server.use(restify.plugins.bodyParser({ mapParams: true }))
server.pre(cors.preflight)
server.use(cors.actual)

server.post('/v0/watchlist/oath', (req, res, next) => {
  watchOath(
    req.params.isWatching,
    req.params.email,
    req.params.oathForgeAddressHexUnprefixed,
    req.params.idNumber
  ).then(() => {
    res.send()
    next()
  }, (err) => {
    next(err)
  })
})

server.post('/v0/subscribe/dex-in-a-box', (req, res, next) => {
  subscribe(
    req.params.firstName,
    req.params.lastName,
    req.params.email,
    ['dex-in-a-box']
  ).then(() => {
    res.send()
    next()
  }, (err) => {
    next(err)
  })
})

server.listen(process.env.PORT || 8080, function () {
  console.log('%s listening at %s', server.name, server.url);
});

server.on('restifyError', (req, res, err, cb) => {
  console.error(err)
  return cb();
});
