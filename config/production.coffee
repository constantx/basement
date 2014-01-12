###jshint node: true###
"use strict"

exports.common = {

}

exports.client = {

}

exports.server = {
  mongolab: process.env.MONGOLAB_URI or process.env.MONGOHQ_URL or 'http://localhost/sportsstreams'
}
