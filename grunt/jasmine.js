module.exports = function(grunt) {
  return {
    src: '<%= ref.dist %>/jquery.ascensor.js',
    options: {
      '--web-security': false,
      '--local-to-remote-url-access': true,
      '--ignore-ssl-errors': true,
      helpers: 'test/helpers/*Helper.js',
      specs: 'test/specs/*Spec.js',
      outfile: 'test/SpecRunner.html',
      template: 'test/SpecRunner.tmpl',
      templateOptions: {
        "jquery_version": "2.1.0"
      }
    },

    ascensor: {
      src: '<%= ref.dist %>/jquery.ascensor.js'
    },

    jquery2_0: {
      src: '<%= ref.dist %>/jquery.ascensor.js',
      options: {
        templateOptions: {
          "jquery_version": "2.0.0"
        }
      }
    },

    jquery1_9: {
      src: '<%= ref.dist %>/jquery.ascensor.js',
      options: {
        templateOptions: {
          "jquery_version": "1.9.0"
        }
      }
    },

    jquery1_8: {
      src: '<%= ref.dist %>/jquery.ascensor.js',
      options: {
        templateOptions: {
          "jquery_version": "1.8.0"
        }
      }
    }
  };
};