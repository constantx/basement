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

    karma:
      unit:
        configFile: 'karma.conf.js'
        autoWatch: true
      continuous:
        configFile: 'karma.conf.js',
        singleRun: true,
        browsers: ['PhantomJS']

    nodemon:
      dev:
        options:
          file: 'server.js'
          ignoredFiles: [
            "*.css"
            "*.styl"
            "*.jade"
            ".slugignore"
            ".git"
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
        tasks: ['stylus']

    notify:
      compiled:
        options:
          message: 'Assets compiled'
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

      jshint:
        files: "<%= jshint.files %>"
        tasks: ["jshint"]

  # load all grunt related modules from package.json
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks)

  grunt.registerTask "default", [
    "compile"
    "concurrent:dev"
  ]

  grunt.registerTask "compile", [
    "concurrent:compile"
    'notify:compiled'
  ]

  grunt.registerTask "build", [
    "compile"
  ]

