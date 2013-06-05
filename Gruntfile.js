module.exports = function(grunt) {
	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		
		projectOptions:{
			src:"src",
			dist:"dist",
			deploy:"deploy"
		},
		
		concat: {
			homepage: {
				src: ['<%= projectOptions.deploy %>/homepage/src/plugins.js','<%= projectOptions.dist %>/jquery.ascensor.min.js'],
				dest: '<%= projectOptions.deploy %>/homepage/dist/plugins.js'
			}
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
			},
			
			homepage: {
				src: '<%= projectOptions.deploy %>/homepage/dist/plugins.js',
				dest: '<%= projectOptions.deploy %>/homepage/dist/plugins.js'
			}
			
		},
		
		jshint: {
			gruntfile: {
				src:'Gruntfile.js'
			},
			
			ascensor: {
				src:'<%= projectOptions.src %>/jquery.ascensor.js'
			}
		},
		
		clean:{
			dist:{
				src: ["dist/"]
			},
			homepage:{
				src: ["./deploy/homepage/dist/"]
			}
		},
		
		watch: {
			homepage: {
				files: ['deploy/homepage/src/**/*.**'],
				tasks: ['home:build']
			},
			
			plugin:{
				files: ['src/*.js'],
				tasks: ['plugin:build']
			}
			
		},
		
		template: {
			simple: {
				src: 'deploy/github/layout.ejs',
				dest: 'examples/example_simple.html',
				variables: {
					title: 'Simple',
					params:''
				}
			},
			
			horizontal: {
				src: 'deploy/github/layout.ejs',
				dest: 'examples/example_horizontal.html',
				variables: {
					title: 'Horizontal',
					params:'{direction:"x"}'
				}
			},
			
			chocolat: {
				src: 'deploy/github/layout.ejs',
				dest: 'examples/example_chocolat.html',
				variables: {
					title: 'Chocolat',
					params:'{direction:"chocolate", ascensorMap: [[0,0],[0,1],[0,2],[1,2],[1,3],[1,4],[2,4]]}'
				}
			},
			
			urlcontrole: {
				src: 'deploy/github/layout.ejs',
				dest: 'examples/example_url.html',
				variables: {
					title: 'Chocolat',
					params:'{ascensorFloorName:["Home", "Implementation", "HTML" , "Jquery" , "CSS", "Smartphone", "End"]}'
				}
			},
			
			queued: {
				src: 'deploy/github/layout.ejs',
				dest: 'examples/example_chocolat_queued.html',
				variables: {
					title: 'Chocolat',
					params:'{direction:"chocolate", ascensorMap: [[0,0],[0,1],[0,2],[1,2],[1,3],[1,4],[2,4]], queued:true, queuedDirection:"y"}'
				}
			},
			
			README:{
				src: 'deploy/github/readme.ejs',
				dest: 'README.md',
				variables: {
					params : require('./deploy/content.json'),
					description: "<%= pkg.description %>"
				}
			},
			
			homepage:{
				src: 'deploy/homepage/src/index.ejs',
				dest: 'deploy/homepage/dist/index.html',
				variables: {
					params : require('./deploy/content.json'),
					description: "<%= pkg.description %>"
				}
			}
		},
		
		sass: {
			homepage: {
				files: {
					'<%= projectOptions.deploy %>/homepage/dist/main.css': './deploy/homepage/src/main.scss'
				}
			}
		},
		
		'ftp-deploy': {
			build: {
				auth: {
					host: 'ftp.kirkas.ch',
					port: 21,
					authKey: 'key1'
				},
				src: './deploy/homepage/dist',
				dest: './ascensor'
			}
		},
		
		jasmine: {
			ascensor: {
				src: 'dist/jquery.ascensor.js',
				options: {
					vendor:[
						'components/jquery/jquery.js', 
						'components/jasmine-jquery/lib/jasmine-jquery.js'
					],
					specs: 'test/spec/*Spec.js'
				}
			},

			jquery2: {
				src: 'dist/jquery.ascensor.js',
				options: {
					vendor:[
						'http://code.jquery.com/jquery-2.0.0.min.js', 
						'components/jasmine-jquery/lib/jasmine-jquery.js'
					],
					specs: 'test/spec/*Spec.js'
				}
			},
			
			jquery19: {
				src: 'dist/jquery.ascensor.js',
				options: {
					vendor:[
						'http://code.jquery.com/jquery-1.9.0.min.js', 
						'components/jasmine-jquery/lib/jasmine-jquery.js'
					],
					specs: 'test/spec/*Spec.js'
				}
			},
			
			jquery18: {
				src: 'dist/jquery.ascensor.js',
				options: {
					vendor:[
						'http://code.jquery.com/jquery-1.8.0.min.js', 
						'components/jasmine-jquery/lib/jasmine-jquery.js'
					],
					specs: 'test/spec/*Spec.js'
				}
			},
			
			jquery17: {
				src: 'dist/jquery.ascensor.js',
				options: {
					vendor:[
						'http://code.jquery.com/jquery-1.7.0.min.js', 
						'components/jasmine-jquery/lib/jasmine-jquery.js'
					],
					specs: 'test/spec/*Spec.js'
				}
			}
		}
		
	});
		
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-jasmine');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-templater');
	grunt.loadNpmTasks('grunt-ftp-deploy');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.registerTask('default', ['jshint']);
	
	
	
	grunt.registerTask('home:build', ['clean:homepage','sass:homepage','concat:homepage','uglify:homepage','template:homepage']);
	grunt.registerTask('plugin:build', ['jshint:ascensor','jasmine:ascensor','clean:dist','uglify:ascensormin','uglify:ascensor','template:README']);
	grunt.registerTask('home:deploy', ['home:build','ftp-deploy']);
	

};