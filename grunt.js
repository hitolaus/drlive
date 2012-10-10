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
          'src/js/vendor/*.js',
          'src/js/title.js',
          'src/js/clock.js',
          'src/js/image.js',
          'src/js/favorites.js',
          'src/js/channels.js',
          'src/js/date.js',
          'src/js/watcher.js',
          'src/js/epg.js',
          'src/js/vod.js',
          'src/js/player.js',
          'src/js/main.js'
        ],
        dest: 'dist/js/<%= pkg.name %>.js'
      },
      css: {
        src: [
          'src/css/*.css'
        ],
        dest: 'dist/css/main.css'
      }
    },
    min: {
      dist: {
        src: ['<banner:meta.banner>', '<config:concat.dist.dest>'],
        dest: 'dist/js/<%= pkg.name %>.min.js'
      }
    },
    lint: {
      files: ['grunt.js', 'src/js/*.js', 'test/*.js']
    },
    qunit: {
      files: ['test/*.html']
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
        Favorites: true,
        VOD: true,
        Clock:true
      }
    },
    uglify: {}
  });

  // Default task.
  grunt.registerTask('default', 'lint concat qunit min');

};
