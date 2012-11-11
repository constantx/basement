### global NR:true, jQuery:true, Backbone:true, $:true, _:true ###
### jslint browser: true, white: true, vars: true, devel: true, bitwise: true, debug: true, nomen: true, sloppy: false, indent: 2 ###

(->
  "use strict"

  $(document).ready ->
    socket = window.io.connect(window.location.hostname)
    socket.emit "hello"
    socket.on "hello-back", (res) ->
      $("#page-content").append "<h1 class='hello'>" + res.data + "</h1>"

)();