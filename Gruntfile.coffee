#jshint node: true
"use strict"

module.exports = (grunt) ->
  grunt.initConfig
    pkg: "<json:package.json>"
    dirs:
      jsSrc: "./public/js"
      dest: "../dist/"

    meta:
      name: "<%= pkg.name %>"
      banner: "/*! <%= meta.name %> - v<%= pkg.version %> - <%= grunt.template.today(\"m/d/yyyy\") %>\n" + "* <%= pkg.homepage %>\n" + "* Copyright (c) <%= grunt.template.today(\"yyyy\") %> <%= pkg.author.name %>;*/"

    jshint:
      options:
        curly: true
        globals:
          require: true

      files: ["*.js", "config/**/*.js", "routes/**/*.js", "test/**/*.js", "public/js/**/*.js", "!public/js/libs/*.js"]

    stylus:
      compile:
        options:
          compress: false

        src: ["stylus/*.styl"]
        dest: "public/css/main.css"


    # coffee: {
    #   compile: {
    #     src: ["coffee/**/*.coffee"],
    #     dest: "./*.js"
    #   }
    # },

    concat:
      dist:
        src: ["<banner>", "public/js/*.js"]
        dest: "<%= dirs.dest %>/public/js/main.js"

    copy:
      dist:
        files:
          "<%= dirs.dest %>/": "./*"
          "<%= dirs.dest %>/config/": "./config/**"
          "<%= dirs.dest %>/routes/": "./routes/**"
          "<%= dirs.dest %>/views/": "./views/**"
          "<%= dirs.dest %>/public/css/": "./public/css/**"
          "<%= dirs.dest %>/public/images/": "./public/images/**"

    watch:
      options:
        interrupt: true
        nospawn: true

      stylus:
        files: "<%= stylus.compile.src %>"
        tasks: ["stylus"]

      jshint:
        files: "<%= jshint.files %>"
        tasks: ["jshint"]

  grunt.loadNpmTasks "grunt-contrib-jshint"
  grunt.loadNpmTasks "grunt-contrib-concat"
  grunt.loadNpmTasks "grunt-contrib-uglify"
  grunt.loadNpmTasks "grunt-contrib-coffee"
  grunt.loadNpmTasks "grunt-contrib-copy"
  grunt.loadNpmTasks "grunt-contrib-stylus"
  grunt.loadNpmTasks "grunt-contrib-watch"

  # "coffee",
  grunt.registerTask "default", ["jshint", "stylus", "watch"]