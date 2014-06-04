module.exports = function(grunt) {
  return {
    server: {
      options: {
        port: 3344,
        base: './',
        livereload: 4321
      }
    }

  };
};