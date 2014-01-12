require('coffee-script')
request       = require 'request'
parseXML      = require('xml2js')
StreamsDigger = require '../modules/StreamsDigger'
games         = require '../modules/schedule'

#
# * GET home page.
#
exports.index = (req, res) ->

  if Object.keys(games).length is 0
    url = "http://www.nfl.com/ajax/scorestrip?season=2013&seasonType=POST&week="

    ###*
     * get current week number
     * TODO: extract this out of here into utils
     * @return {Number} week number
    ###
    Date.prototype.getWeek = ->
      onejan = new Date(this.getFullYear(),0,1);
      return Math.ceil((((this - onejan) / 86400000) + onejan.getDay()+1)/7)


    date = new Date()
    week = date.getWeek()

    console.log("week is #{week}")


    request url + week, (err, resp, body) ->
      parseXML.parseString body, (err, json) ->
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

          time = game.t.split 'pm'

          gameDate = new Date(dateString + ' ' + time)

          # 24-hour clock + difference between UTC (EDT games)
          gameDate.setHours(parseInt(gameDate.getHours(),10) + 17)

          minDiff = Math.floor(((Math.abs gameDate - date)/1000)/60)
          console.log minDiff

          # If within 15 minutes of game, search for stream
          if minDiff < 60
            StreamsDigger.getStream newGame.hTeam, dateStringId

            console.log date, gameDate, minDiff, newGame.hTeam

          # I don't know if I actually need this but too lazy to check
          x += 1

          if x is xmlGames.length
            console.log games

            res.render "index",
              title: "basement"
              games: games
  else
    res.render "index",
      title: "basement"
      games: games
