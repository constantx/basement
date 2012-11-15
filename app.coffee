# hello dolly
express = require("express")
routes  = require("./routes")
http    = require("http")
path    = require("path")
app     = express()
server  = http.createServer(app)
fs      = require("fs")
PORT    = process.env.PORT or 3000
IO      = require("socket.io").listen(server)
stylus  = require('stylus')
nib     = require('nib')

# Configuration
app.configure ->
  app.set "port", process.env.PORT or PORT
  app.set "views", "#{__dirname}/views"
  app.set "view engine", "jade"
  app.locals.pretty = true
  app.locals.layout = false
  app.use express.favicon()
  app.use express.logger("dev")
  app.use express.bodyParser()
  app.use express.methodOverride()
  app.use app.router
  app.use stylus.middleware
    debug: true
    src:  "#{__dirname}/stylus"
    dest: "#{__dirname}/public/css"
    compile: (str, path) ->
      stylus(str)
        .set("filename", path)
        .set("compress", true)
        .use(nib())
        .import('nib')
  app.use express.static(path.join(__dirname, "public/"))

# environment specific config 
app.configure "development", ->
  app.use express.errorHandler(
    dumpExceptions: true
    showStack: true
  )

app.configure "production", ->
  app.use express.errorHandler()


# Routes
app.get "/", routes.index

# Only listen on $ node app.js
unless module.parent
  server.listen app.get("port"), ->
    console.log "Express server listening on port #{app.get("port")}"


#////////////////////////////////////////////////////////
# SOCKET.IO
IO.configure "development", ->
  IO.set "log level", 2

IO.configure "production", ->
  # enable all transports (optional if you want flashsocket)
  IO.set "transports", ["websocket", "flashsocket", "htmlfile", "xhr-polling", "jsonp-polling"]
  IO.set "polling duration", 10 # heroku polling duration
  IO.enable "browser client minification" # send minified client
  IO.enable "browser client etag" # apply etag caching logic based on version number
  IO.enable "browser client gzip" # gzip the file
  IO.set "log level", 1 # reduce logging

IO.sockets.on "connection", (socket) ->
  socket.on "hello", ->
    socket.emit "hello-back",
      data: "the basement"


