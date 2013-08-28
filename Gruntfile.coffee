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
      app:
        options:
          compress: false
        files: [
          expand: true
          cwd: "<%= dirs.app %>/stylus"
          src: ["**/*.styl", "!partials/*.styl"]
          dest: "<%= dirs.app %>/public/css/"
          ext: ".css"
        ]

    coffee:
      app:
        options:
          compress: false
        files: [
          expand: true
          cwd: "<%= dirs.app %>/coffee"
          src: ["**/*.coffee"]
          dest: "<%= dirs.app %>/"
          ext: ".js"
        ]

    nodemon:
      dev:
        options:
          file: 'server.js'
          ignoredFiles: [
            "*.css"
            "*.styl"
            "*.jade"
            "*.js"
            ".slugignore"
            "app/coffee/public/*"
            "app/public/*"
            "readme*"
            "Gruntfile*"
            "Makefile*"
            "Procfile*"
          ]
          # watchedExtensions: ['js']
          # watchedFolders: ['test', 'tasks']
          # env: {}
          # cwd: __dirname
          debug: true
          delayTime: 1

    concurrent:
      dev:
        tasks: ['nodemon', 'watch']
        options:
          logConcurrentOutput: true
      compile:
        tasks: ['stylus', 'coffee']

    notify:
      compiled:
        options:
          message: 'Assets compiled'
      coffee:
        options:
          message: 'Coffee compiled'
      stylus:
        options:
          message: 'Stylus compiled'

    watch:
      options:
        interrupt: true
        nospawn: true

      stylus:
        files: "<%= stylus.app.files[0].cwd %>/**/*.styl"
        tasks: ["stylus", "notify:stylus"]

      coffee:
        files: "<%= coffee.app.files[0].cwd %>/**/*.coffee"
        tasks: ["coffee", "notify:coffee"]

      jshint:
        files: "<%= jshint.files %>"
        tasks: ["jshint"]

  # load all grunt related modules from package.json
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks)

  grunt.registerTask "compile", [
    "concurrent:compile"
    'notify:compiled'
  ]

  grunt.registerTask "default", [
    "compile"
    "concurrent:dev"
  ]
