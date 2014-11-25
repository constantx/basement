var domready = require('domready');
var Ractive = require('ractive');

domready(function () {
  console.warn('dom ready');

  var HUD = new Ractive.extend({
    oninit: function () {
      console.log('ractivated');
    }
  });

  console.log('hud', HUD);
});
