module.exports = function(grunt) {

  /* Grunt task load */
  require('time-grunt')(grunt);

  require('load-grunt-config')(grunt, {
    config: {
      pkg: grunt.file.readJSON('package.json'),
      ref: {
        src: "src",
        dist: "dist"
      },
      banner: '/*\n' +
        '<%= pkg.name %> \n' +
        'version: <%= pkg.version %> (<%= grunt.template.today("yyyy-mm-dd") %>)\n' +
        'description: <%= pkg.description %>\n' +
        'repository: <%= pkg.repository %>\n' +
        'license: <%= pkg.license %>\n' +
        'author: <%= pkg.author %>\n' +
        '*/\n'
    }

  });

  grunt.registerTask('build', [
    'clean:dist',
    'jshint:ascensor',
    'concat:ascensor',
    'uglify:ascensormin',
    'jasmine'
  ]);

  grunt.registerTask('server', ['connect', 'watch']);

};