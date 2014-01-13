/*jslint indent:2, node:true, nomen:true, unparam: true */
/*global require:false */

(function () {
  "use strict";

  var SCHEDULE = {};
  var leagues = ['nfl'];
  var scheduleDigger = require('../modules/ScheduleDigger');
  var StreamsDigger = require('../modules/StreamsDigger');

  var formatSchedule = function(league, json){
    var games = {}, date = new Date(), dateString, dateStringId, gId, game, gameDate, mNum, minDiff, months, newGame, time, x, xmlGames, _i, _len;

    months = ['January', 'February'];

    xmlGames = json.ss.gms[0].g;

    x = 0;

    for (_i = 0, _len = xmlGames.length; _i < _len; _i++) {
      game = xmlGames[_i];
      game = game.$;
      mNum = game.eid.substring(4, 6);
      gId = game.eid.substring(8, 10);
      newGame = {
        gMonth: months[parseInt(mNum, 10) - 1],
        gDay: game.eid.substring(6, 8),
        time: game.t,
        hTeam: game.hnn,
        hScore: game.hs,
        vTeam: game.vnn,
        vScore: game.vs,
        sTime: game.t
      };
      dateString = '2014-' + mNum + '-' + newGame.gDay;
      dateStringId = dateString + '-' + gId;
      if (!games[dateStringId]) {
        games[dateStringId] = newGame;
      }
      time = game.t.split('pm');
      gameDate = new Date(dateString + ' ' + time);
      gameDate.setHours(parseInt(gameDate.getHours(), 10) + 17);
      minDiff = Math.floor(((Math.abs(gameDate - date)) / 1000) / 60);
      console.log(minDiff);
      if (minDiff < 60) {
        // try to find the right stream url and add it this game
        console.log(date, gameDate, minDiff, newGame.hTeam);
        StreamsDigger.getStream(game, newGame.hTeam);
      }
      x += 1;
    }

    SCHEDULE[league] = games;

    return;
  };

  // once we hear about the data, make the game list available right away
  // while we look for stream url
  scheduleDigger.on('data', function(league, json){
    SCHEDULE[league] = json.ss.gms[0].g;
  });

  // format and look for the stream urls
  scheduleDigger.once('data', formatSchedule);

  // get schedule for each league
  // TODO: run this once every hour to update schedule
  leagues.forEach(function(league, i){
    scheduleDigger.getSchedule(league);
  });

  exports = module.exports = SCHEDULE;
}());
