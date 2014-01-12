/*jslint indent:2, node:true, nomen:true, unparam: true */
/*global require:false */

(function () {
  "use strict";

  var schedule = {};
  var leagues = ['nfl'];
  var scheduleDigger = require('../modules/ScheduleDigger');

  scheduleDigger.once('data', function(league, data){
    schedule[league] = data;
  });

  leagues.forEach(function(league, i){
    scheduleDigger.getSchedule(league);
  });

  exports = module.exports = schedule;
}());
