'use strict';

module.exports = function(grunt) {
  grunt.initConfig({
    pkg: '<json:package.json>',
    dirs: {
      'server': './server',
      'client': './client',
      'public': './public'
    },
    meta: {
      name: '<%= pkg.name %>',
      banner: [
        '/*! <%= meta.name %> - v<%= pkg.version %> -',
        '<%= grunt.template.today(\'m/d/yyyy\') %>\n',
        '* <%= pkg.homepage %>\n',
        '* Copyright (c) <%= grunt.template.today(\'yyyy\') %>',
        '<%= pkg.author.name %>;*/'
      ].join('')
    },
    // Task configuration.
    jshint: {
      client: {
        src: [
          '<%= dirs.client %>/**/*.js'
        ],
        options: {
          jshintrc: true
        }
      },
      server: {
        src: [
          'Gruntfile.js',
          '<%= dirs.server %>/**/*.js'
        ],
        options: {
          jshintrc: true
        }
      }
    },

    jscs: {
      src: [
        '<%= jshint.client.src %>',
        '<%= jshint.server.src %>'
      ],
      options: {
        config: '.jscsrc'
      }
    },

    nodemon: {
      dev: {
        cwd: './',
        script: '<%= dirs.server %>/server.js',
        options: {
          ignore: [
            'Gruntfile.js',
            '<%= dirs.client %>/',
            '<%= dirs.public %>/'
          ],
          env: {
            PORT: '5000'
          },
          delay: 500
        }
      }
    },

    browserify: {
      options: {
        watch: process.env.NODE_ENV === 'development',
        transform: [
          ['ractivate', {
            extensions: ['.mustache']
          }]
        ]
      },

      client: {
        files: [{
          src: '<%= dirs.client %>/boot.js',
          dest: '<%= dirs.public %>/js/bundle.js'
        }],
        options: {
          watch: process.env.NODE_ENV === 'development',
          browserifyOptions: {
            // must enable debug mode to gernerate source map for minifyify
            // to externalize the map itself
            debug: process.env.NODE_ENV === 'development'
          }
        }
      }
    },
    svgstore: {
      markers: {
        options: {
          prefix : 'icon-',
          cleanupdefs: true,
          formatting : {
            'indent_size' : 2
          }
        },
        files: [{
          src: '<%= dirs.client %>/**/*.svg',
          dest: '<%= dirs.server %>/views/partials/svg-store.svg'
        }]
      },
    },
    stylus: {
      options: {
        // directories to scan for @import directives when parsing
        paths: [
          'stylus'
        ]
      },
      all: {
        options: {
          compress: (process.env.NODE_ENV !== 'development'),
          linenos: (process.env.NODE_ENV === 'development')
        },
        files: [{
          expand: true,
          cwd: './stylus',
          src: ['*.styl', '!modules/**/*'],
          dest: '<%= dirs.public %>/css/',
          ext: '.css'
        }]
      }
    },
    // client-side test only
    mocha: {
      test: {
        src: [
          './test/**/*.html'
        ],
        options: {
          run: true,
          growlOnSuccess: true,
          timeout: 10000,
          bail: true
        }
      }
    },
    concurrent: {
      dev: {
        tasks: ['nodemon', 'watch'],
        options: {
          logConcurrentOutput: true
        }
      },
      compile: {
        tasks: ['stylus', 'svgstore', 'browserify'],
        options: {
          logConcurrentOutput: false
        }
      }
    },
    watch: {
      options: {
        livereload: true
      },
      client: {
        files: [
          '<%= jshint.client.src %>'
        ],
        tasks: ['compile', 'lint']
      },
      mustache: {
        files: [
          '<%= dirs.client %>/**/*.mustache'
        ],
        tasks: ['compile']
      },
      server: {
        files: [
          '<%= jshint.server.src %>'
        ],
        tasks: ['lint']
      },
      svgstore: {
        files: [
          '<%= svgstore.markers.files[0].src %>'
        ],
        tasks: ['svgstore']
      },
      stylus: {
        files: [
          '<%= stylus.all.files[0].cwd %>/**/*.styl'
        ],
        tasks: ['stylus']
      }
    }
  });
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
  // browserify and lint them all for syntax and code styles
  grunt.registerTask('lint', ['jshint', 'jscs']);

  // `$ grunt compile`
  grunt.registerTask('compile', ['concurrent:compile']);

  // browserify and lint them all for syntax and code styles
  grunt.registerTask('lint', ['jshint', 'jscs']);

  // `$ grunt build`
  grunt.registerTask('build', 'build assets', function() {
    grunt.task.run(['compile']);
  });

  // `$ grunt test`
  grunt.registerTask('test', ['lint', 'mocha']);

  // `$ grunt`
  grunt.registerTask('default', ['compile', 'concurrent:dev']);
};
