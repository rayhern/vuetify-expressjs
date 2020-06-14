const path = require('path')
const express = require('express')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
const app = express()

// Import and Set Nuxt.js options
const config = require('../nuxt.config.js')
config.dev = process.env.NODE_ENV !== 'production'

async function start () {
  // Init Nuxt.js
  const nuxt = new Nuxt(config)
  const { host, port } = nuxt.options.server
  await nuxt.ready()
  const refreshAPI = () => {
    Object.keys(require.cache).forEach((id) => {
      if (id.startsWith(`${path.join(__dirname, 'api')}${path.sep}`)) {
        delete require.cache[id]
      }
    })
  }

  // Build only in dev mode
  if (config.dev) {
    const chokidar = require('chokidar')
    const watcher = chokidar.watch(path.join(__dirname, 'api'))
    watcher.on('add', refreshAPI)
    watcher.on('change', refreshAPI)
    const builder = new Builder(nuxt)
    await builder.build()
  }

  // Give nuxt middleware to express
  app.use(express.json())
  app.use(express.urlencoded({ extended: false }))
  app.use('/api', (req, res, next) => { require('./api/index.js')(req, res, next) })
  app.use(nuxt.render)

  // Listen the server
  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}
start()
