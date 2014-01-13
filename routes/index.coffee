require('coffee-script')
schedule = require('../models/Schedule.js')

#
# * GET home page.
#

exports.index = (req, res) ->
  res.render "index",
    title: "basement"
    games: schedule.nfl
