module.exports = function(grunt) {
  return {
    desktop: {
      configFile: 'karma.conf.js'
    },
    // browserstack: {
    //   configFile: 'karma.conf.js',
    //   browsers: ['IE_8', 'IE_9', 'IE_10']
    // },
    // device: {
    //   configFile: 'karma.conf.js',
    //   browsers: ['android_old', 'android_latest', 'ios_6', 'ios_7']
    // }
  };
};