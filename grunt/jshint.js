module.exports = function(grunt) {
  return {
    gruntfile: {
      src: ['Gruntfile.js', 'grunt/**/*.js']
    },
    ascensor: {
      src: '<%= ref.src %>/jquery.ascensor.js'
    },
    test: {
      src: 'test/**/*.js'
    }
  };
};