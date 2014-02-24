module.exports = function(grunt) {
  return {
    gruntfile: {
      src: 'Gruntfile.js'
    },

    ascensor: {
      src: '<%= ref.src %>/jquery.ascensor.js'
    }
  };
};