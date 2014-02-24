module.exports = function(grunt) {
  return {
    plugin: {
      files: ['<%= ref.src %>/jquery.ascensor.js'],
      tasks: ['jshint:ascensor', 'uglify:ascensor']
    },
    gruntfile: {
      files: ['Gruntfile.js', 'grunt/**/*.js'],
      tasks: ['jshint:gruntfile']
    },
    examples: {
      files: ['examples/example_layout.ejs'],
      tasks: ['template']
    }
  };
};