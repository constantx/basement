require('coffee-script')
request = require 'request'
parseXML = require('xml2js').parseString
getStream = require './getStream'
games = require './schedule'

#
# * GET home page.
#
exports.index = (req, res) ->
  url = "http://www.nfl.com/ajax/scorestrip?season=2013&seasonType=POST&week="

  date = new Date()
  week = 19

  # Don't even care
  week = 20 if date.getDate() > 12
  week = 22 if date.getDate() is 2

  request url + week, (err, resp, body) ->
    parseXML body, (err, json) ->
      months = ['January', 'February']
      xmlGames = json.ss.gms[0].g
      x = 0

      for game in xmlGames
        game = game.$
        mNum = game.eid.substring 4, 6
        gId = game.eid.substring 8, 10

        newGame =
          gMonth: months[parseInt(mNum, 10) - 1]
          gDay: game.eid.substring 6, 8
          time: game.t
          hTeam: game.hnn
          hScore: game.hs
          vTeam: game.vnn
          vScore: game.vs
          sTime: game.t

        dateString = '2014-' + mNum + '-' + newGame.gDay
        dateStringId = dateString + '-' + gId

        # Store in games array
        # TODO: Should build this into Mongo/db so we aren't fetching every time
        if !games[dateStringId]
          games[dateStringId] = newGame

        time = game.t.split ':'

        # 24-hour clock + difference between UTC (EDT games)
        hour = parseInt(time[0], 10) + 12 - 5

        dateNow = new Date(dateString + ' ' + [hour, time[1]].join ':')
        minDiff = (((Math.abs dateNow - date)/1000)/60)
        console.log date, dateNow
        console.log minDiff

        # If within 15 minutes of game, search for stream
        if minDiff < 15
          getStream newGame.hTeam, dateStringId

        if x is 1
          getStream newGame.hTeam, dateStringId
        x += 1

        if x is xmlGames.length

          res.render "index",
            title: "basement"
            games: games
