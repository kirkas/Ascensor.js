module.exports = function(grunt) {
  return {
    server: {
      options: {
        port: 1234,
        base: './',
        livereload: 4321
      }
    }

  };
};