module.exports = function(grunt) {
  return {
    options: {
      livereload: 4321
    },
    plugin: {
      files: ['<%= ref.src %>/jquery.ascensor.js'],
      tasks: ['jshint:ascensor', 'concat:ascensor', 'uglify:ascensormin']
    },
    gruntfile: {
      files: ['Gruntfile.js', 'grunt/**/*.js'],
      tasks: ['jshint:gruntfile']
    },
    test: {
      files: ['test/**/*.js'],
      tasks: ['jshint:test']
    },
    examples: {
      files: ['examples/example_layout.ejs', 'grunt/template.js'],
      tasks: ['template']
    }
  };
};