module.exports = function(grunt) {
  return {

    options: {
      files: ['package.json', 'bower.json', 'Ascensor.js.jquery.json'],
      updateConfigs: ['pkg'],
      commitFiles: ['-a'],
      pushTo: 'origin'
    }

  };
};