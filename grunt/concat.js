module.exports = function(grunt) {
  return {
    plugin: {
      src: [
        '<%= ref.src %>/open.js',
        '<%= ref.src %>/ie8.js',
        '<%= ref.src %>/detectTransform.js',
        '<%= ref.src %>/resize.js',
        '<%= ref.src %>/map.js',
        '<%= ref.src %>/direction.js',
        '<%= ref.src %>/hash.js',
        '<%= ref.src %>/scrollTo.js',
        '<%= ref.src %>/trigger.js',
        '<%= ref.src %>/checkKey.js',
        '<%= ref.src %>/setup.js',
        '<%= ref.src %>/close.js'
      ],
      dest: '<%= ref.src %>/jquery.ascensor.js'
    }
  };
};