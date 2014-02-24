module.exports = function(grunt) {
  return {
    dist: {
      src: ["<%= ref.dist %>/"]
    },
    after: {
      src: ["<%= ref.src %>/jquery.ascensor.js"]
    }
  };
};