###jshint node: true###

"use strict"

module.exports = (grunt) ->

  #setup config
  grunt.initConfig
    pkg: "<json:package.json>"
    
    dirs:
      jsSrc: './public/js'
      # dest: '../dist/<%= pkg.name %>-<%= pkg.version %>'
      dest: '../dist/'

    meta:
      name: "<%= pkg.name %>"
      banner: "/*! <%= meta.name %> - v<%= pkg.version %> - <%= grunt.template.today(\"m/d/yyyy\") %>\n" + "* <%= pkg.homepage %>\n" + "* Copyright (c) <%= grunt.template.today(\"yyyy\") %> <%= pkg.author.name %>;*/"
    
    lint:
      files: [
        "*.js"
        "config/*.js"
        "routes/*.js"
        "mocha/test/**/*.js"
        "public/js/*.js"
        "public/js/views/*.js"
        "public/js/models/*.js"
      ]

    concat:
      dist:
        src: [ "<banner>", "public/js/*.js" ]
        dest: '<%= dirs.dest %>/public/js/main.js'

    copy:
      dist:
        files:
          "<%= dirs.dest %>/"                     : "./*"
          "<%= dirs.dest %>/config/"              : "./config/**"
          "<%= dirs.dest %>/routes/"              : "./routes/**"
          "<%= dirs.dest %>/views/"               : "./views/**"
          "<%= dirs.dest %>/public/css/"          : "./public/css/**"
          "<%= dirs.dest %>/public/images/"       : "./public/images/**"

  # load thirdparty grunt task
  grunt.loadNpmTasks 'grunt-contrib'
  
  # Default task.
  # grunt.registerTask "default", "lint concat min"
  grunt.registerTask "default", "lint"

  # Build for distribution task
  grunt.registerTask "build", "lint copy"

