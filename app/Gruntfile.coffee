#jshint node: true
"use strict"

module.exports = (grunt) ->
  grunt.initConfig
    pkg: "<json:package.json>"
    dirs:
      app: "./"

    meta:
      name: "<%= pkg.name %>"
      banner: "/*! <%= meta.name %> - v<%= pkg.version %> - <%= grunt.template.today(\"m/d/yyyy\") %>\n" + "* <%= pkg.homepage %>\n" + "* Copyright (c) <%= grunt.template.today(\"yyyy\") %> <%= pkg.author.name %>;*/"

    jshint:
      options:
        curly: true
        globals:
          require: true

      files: [
        "*.js",
        "config/**/*.js"
        "routes/**/*.js"
        "test/**/*.js"
        "public/js/**/*.js"
        "!public/js/libs/*.js"
      ]

    stylus:
      extension:
        options:
          compress: false
        files: [
          expand: true # Enable dynamic expansion.
          cwd: "<%= dirs.extension %>/stylus" # Src matches are relative to this path
          src: ["**/*.styl", "!partials/*.styl"] # Actual pattern(s) to match, dont compile partials
          dest: "<%= dirs.extension_compiled %>/css" # Destination path prefix.
          ext: ".css" # Dest filepaths will have this extension.
        ]
      # we might not even get to use it here, but let's keep the task for now, why not?
      app:
        options:
          compress: false
        files: [
          expand: true # Enable dynamic expansion.
          cwd: "<%= dirs.app %>/stylus" # Src matches are relative to this path
          src: ["**/*.styl", "!partials/*.styl"] # Actual pattern(s) to match, dont compile partials
          dest: "<%= dirs.app %>/public/css/" # Destination path prefix.
          ext: ".css" # Dest filepaths will have this extension.
        ]

    coffee:
      app:
        options:
          compress: false
        files: [
          expand: true # Enable dynamic expansion.
          cwd: "<%= dirs.app %>/coffee" # Src matches are relative to this path
          src: ["**/*.coffee"] # Actual pattern(s) to match.
          dest: "<%= dirs.app %>/" # Destination path prefix.
          ext: ".js" # Dest filepaths will have this extension.
        ]

    watch:
      options:
        interrupt: true
        nospawn: true

      stylus:
        files: [
          "<%= stylus.app.files[0].cwd %>/**/*.styl"
          "<%= stylus.extension.files[0].cwd %>/**/*.styl"
        ]
        tasks: ["stylus"]

      coffee_app:
        files: [
          "<%= coffee.app.files[0].cwd %>/**/*.coffee"
        ]
        tasks: ["coffee:app"]

    # concat:
    #   dist:
    #     src: ["<banner>", "public/js/*.js"]
    #     dest: "<%= dirs.dest %>/public/js/main.js"

    # copy:
    #   dist:
    #     files:
    #       "<%= dirs.dest %>/": "./*"
    #       "<%= dirs.dest %>/config/": "./config/**"
    #       "<%= dirs.dest %>/routes/": "./routes/**"
    #       "<%= dirs.dest %>/views/": "./views/**"
    #       "<%= dirs.dest %>/public/css/": "./public/css/**"
    #       "<%= dirs.dest %>/public/images/": "./public/images/**"

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

  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);


  # "coffee",
  grunt.registerTask "default", ["coffee", "stylus", "watch"]