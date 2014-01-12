request = require 'request'
games   = require './schedule'
io      = require '../app-socket'

exports = module.exports =

  getStream = (team, id, cb) ->

    return if !team or !id

    i = 1

    getURL = ->
      streamURL = "http://nlds" + i + ".cdnak.neulion.com/nlds/nfl/" + team + "/as/live/" + team + "_hd_800.m3u8"

      request streamURL, (err, resp, body) ->
        if err != null and resp != 'undefined'
          io.sockets.emit 'stream',
            url: streamURL
            team: team
          console.log team + ' stream is ' + streamURL
          games[id].stream = streamURL
          if cb cb(streamURL)
        else
          console.log i
          getURL()

        i++

    getURL()
