/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: '<json:package.json>',
    meta: {
      banner: '/*! <%= pkg.title || pkg.name %>, v<%= pkg.version %> build: ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>' +
        ' Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>; */'
    },
    concat: {
      dist: {
        src: [
          '<banner:meta.banner>',
          'src/vendor/*.js',
          'src/title.js',
          'src/image.js',
          'src/favorites.js',
          'src/channels.js',
          'src/date.js',
          'src/watcher.js',
          'src/epg.js',
          'src/player.js',
          'src/main.js'
        ],
        dest: 'dist/js/<%= pkg.name %>.js'
      }
    },
    min: {
      dist: {
        src: ['<banner:meta.banner>', '<config:concat.dist.dest>'],
        dest: 'dist/js/<%= pkg.name %>.min.js'
      }
    },
    lint: {
      files: ['grunt.js', 'src/*.js', 'test/**/*.js']
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true
      },
      globals: {
        jQuery: true,
        $: true,
        jwplayer: true,
        console: true,
        boxeeAPI: true,
        browser: true,
        boxee: true,
        // Internal classes. We need them here since we lint before concatenation so the classes 
        // are unknown
        Channels: true,
        Epg: true,
        Watcher: true,
        Player: true,
        Title: true,
        Favorites: true
      }
    },
    uglify: {}
  });

  // Default task.
  grunt.registerTask('default', 'lint concat min');

};
