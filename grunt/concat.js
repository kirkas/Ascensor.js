module.exports = function(grunt) {
  return {

    ascensor: {
      src: ["<%= ref.src %>/jquery.ascensor.js"],
      dest: "<%= ref.dist %>/jquery.ascensor.js"
    },
    options: {
      banner: "<%= banner %>"
    }

  };
};