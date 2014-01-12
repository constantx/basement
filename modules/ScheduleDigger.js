/*jslint indent:2, node:true, nomen:true, unparam: true */
/*global require:false */

(function () {
  "use strict";

  var request  = require('request');

  var util     = require('util');

  var events   = require("events");

  var urlSchedule = "http://#{leagueType}.myfantasyleague.com/2013/export?JSON=1&TYPE=#{league}Schedule";

  var ScheduleEvent = function(){};

  var leagueType = {
    'nfl': 'football',
    'nhl': 'hockey'
  };

  util.inherits(ScheduleEvent, events.EventEmitter);

  var schedule = new ScheduleEvent();

  var getSchedule = function(league){
    if(!league) return;

    urlSchedule = urlSchedule.replace("#{league}", league);
    urlSchedule = urlSchedule.replace("#{leagueType}", leagueType[league]);

    request(urlSchedule, function (err, res, body){
      if(!err && res.statusCode == 200){
        schedule.emit('data', league, JSON.parse(body));
      }
    });
  };

  schedule.getSchedule = getSchedule;

  exports = module.exports = schedule;

}());
