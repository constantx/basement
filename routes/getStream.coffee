request = require 'request'
games = require './schedule'
server = require('../server')

module.exports = (team, id) ->
  i = 1

  getStream = ->
    streamURL = "http://nlds" + i + ".cdnak.neulion.com/nlds/nfl/" + team + "/as/live/" + team + "_hd_800.m3u8"

    request streamURL, (err, resp, body) ->
      if err != null and resp != 'undefined'
        server.io.sockets.emit 'stream',
          url: streamURL
          team: team
        console.log team + ' stream is ' + streamURL
        games[id].stream = streamURL
      else
        console.log i
        getStream()

      i++

  getStream()
