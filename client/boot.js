/* global io */

var domready = require('domready');
var Ractive = require('ractive');
var socket = io();
var debug = require('debug')('boot');

domready(function () {
  debug('dom ready');

  var HUD = new Ractive({
    el: 'body',
    append: true,
    oninit: function () {
      console.log('ractivated');
      socket.on('hello back', function (msg) {
        document.getElementById('hello').innerHTML = msg.data;
      });

      socket.emit('hello');
    }
  });

  return HUD;
});
