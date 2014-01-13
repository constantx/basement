/*jslint indent:2, node:true, nomen:true, unparam: true */
/*global require:false */

(function () {
  "use strict";

  var request = require('request');

  exports = module.exports = {
    getStream: function(game, team) {
      console.log('getting stream url');

      var getURL, i = 1;

      if (!team) {
        return;
      }

      getURL = function() {
        var streamURL;
        streamURL = "http://nlds" + i + ".cdnak.neulion.com/nlds/nfl/" + team + "/as/live/" + team + "_hd_800.m3u8";

        console.log('checking stream url', streamURL);

        return request(streamURL, function(err, resp, body) {
          if (err !== null && resp !== 'undefined') {
            console.log(team + ' stream is ' + streamURL);
            game.streamURL = streamURL;
            game.active = true;
            return;
          } else {
            setTimeout(getURL, 300);
          }
          return i++;
        });
      };

      getURL();
    }
  };

}());
