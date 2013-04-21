module.exports = function(grunt) {
	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		
		projectOptions:{
			src:"src",
			dist:"dist"	
		},
		
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
			},

			ascensor:{
				options:{
					beautify: true,
					mangle:false,
					preserveComments:true
				},
				src: '<%= projectOptions.src %>/jquery.ascensor.js',
				dest: '<%= projectOptions.dist %>/jquery.ascensor.js'
			},
			
			ascensorstripped: {
				options:{
					beautify: true,
					mangle:false
				},
				src: '<%= projectOptions.src %>/jquery.ascensor.js',
				dest: '<%= projectOptions.dist %>/jquery.ascensor.stripped.js'
			},
			
			ascensormin: {
				src: '<%= projectOptions.src %>/jquery.ascensor.js',
				dest: '<%= projectOptions.dist %>/jquery.ascensor.min.js'
			}
		},
		
		jshint: {
			gruntfile: {
				src:'Gruntfile.js'
			},
			
			ascensorsrc: {
				src:'<%= projectOptions.src %>/jquery.ascensor.js'
			}
		},
		
		clean:{
			dist:{
				src: ["dist/"]
			}
		}
		
	});
	
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-clean');
	
	grunt.registerTask('default', ['jshint']);
	grunt.registerTask('build', ['clean', 'jshint', 'uglify']);
	
};