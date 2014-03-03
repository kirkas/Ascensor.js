module.exports = function(grunt) {
  return {
    options: {
      banner: "<%= banner %>"
    },

    ascensormin: {
      src: '<%= ref.src %>/jquery.ascensor.js',
      dest: '<%= ref.dist %>/jquery.ascensor.min.js'
    }
  };
};