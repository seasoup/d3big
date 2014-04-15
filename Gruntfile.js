module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      jshintsrc: 'config/jshint.json',
      all: ['Gruntfile.js', 'app.js', 'single.js']
    },
    watch: {
      copier: {
        files: [ 'public_src/**' ] ,
        options: {
          spawn: false, 
          livereload: false
        }
      },
      restart_node: {
        files: ['app.js', 'node_modules/**.*'],
        tasks: ['develop'],
        options: { nospawn: true }
      }
    },
    copy: {
      main: {
        files: [
          { src: '**', dest: 'public/', expand: true, filter: 'isFile', cwd: 'public_src/'},
          { src: '**', dest: 'public/js/lib/', expand: true, cwd: 'bower_components/'}
        ]
      }
    },
    develop: {
      server: {
        file: 'app.js'
      }
    },
    clean: [ "public" ]
  });

  grunt.event.on('watch', function(action, filepath) {
    grunt.config(['jshint', 'all'], filepath);
    grunt.task.run('clean');
    grunt.task.run('copy');
//    grunt.task.run('develop');
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-develop');

  // Default task(s).
  grunt.registerTask('default', ['develop', 'watch']);

};