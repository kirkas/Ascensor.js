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
				banner: '/*\n'+
								'<%= pkg.name %> \n'+
								'version: <%= pkg.version %> (<%= grunt.template.today("yyyy-mm-dd") %>)\n'+
								'description: <%= pkg.description %>\n'+
								'repository: <%= pkg.repository %>\n'+
								'license: <%= pkg.license %>\n'+
								'author: <%= pkg.author %>\n'+
								'*/\n'
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
		},
		
		watch: {
			scripts: {
				files: ['src/*.js'],
				tasks: ['jshint:ascensorsrc']
			}
		}
		
	});
	
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-watch');
	
	grunt.registerTask('default', ['jshint']);
	grunt.registerTask('build', ['clean', 'jshint', 'uglify']);
	
};