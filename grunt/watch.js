module.exports = function(grunt) {
  return {
    plugin: {
      files: ['<%= ref.src %>**/*.js', '!<%= ref.src %>jquery.ascensor.js'],
      tasks: ['concat:plugin', 'uglify:ascensor']
    },
    examples: {
      files: ['Gruntfile.js'],
      tasks: ['jshint:gruntfile']
    },
    examples: {
      files: ['examples/example_layout.ejs'],
      tasks: ['template']
    }
  };
};