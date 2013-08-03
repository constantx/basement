# hello dolly
express = require("express")
http    = require("http")
path    = require("path")
fs      = require("fs")
routes  = require("./routes")
app     = express()
server  = http.createServer(app)
IO      = require("socket.io").listen(server)
PORT    = process.env.PORT or 3000

# Configuration
app.configure ->
  app.set "port", process.env.PORT or PORT
  app.set "views", "#{__dirname}/views"
  app.set "view engine", "jade"
  app.use express.favicon()
  app.use express.logger("dev")
  app.use express.bodyParser()
  app.use express.methodOverride()
  app.use app.router
  app.use express.static(path.join(__dirname, "public/"))

# environment specific config 
app.configure "development", ->
  app.use express.errorHandler
    dumpExceptions: true
    showStack: true
  app.locals.pretty = true

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


