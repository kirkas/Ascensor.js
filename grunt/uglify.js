module.exports = function(grunt) {
  return {
    options: {
      banner: '/*\n' +
        '<%= pkg.name %> \n' +
        'version: <%= pkg.version %> (<%= grunt.template.today("yyyy-mm-dd") %>)\n' +
        'description: <%= pkg.description %>\n' +
        'repository: <%= pkg.repository %>\n' +
        'license: <%= pkg.license %>\n' +
        'author: <%= pkg.author %>\n' +
        '*/\n'
    },

    ascensor: {
      options: {
        beautify: true,
        mangle: false,
        preserveComments: true,
        compress: false,
        indentLevel: 2
      },
      files: {
        '<%= ref.dist %>/jquery.ascensor.js': ['<%= ref.src %>/jquery.ascensor.js']
      }
    },

    ascensormin: {
      src: '<%= ref.src %>/jquery.ascensor.js',
      dest: '<%= ref.dist %>/jquery.ascensor.min.js'
    }
  };
};