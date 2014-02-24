module.exports = function(grunt) {

  /* Grunt task load */
  require('time-grunt')(grunt);

  require('load-grunt-config')(grunt, {
    config: {
      pkg: grunt.file.readJSON('package.json'),
      ref: {
        src: "src",
        dist: "dist"
      }
    }
  });

  grunt.registerTask('build', [
    'clean:dist',
    'jshint:ascensor',
    'uglify:ascensor',
    'uglify:ascensormin',
    'jasmine'
  ]);

};