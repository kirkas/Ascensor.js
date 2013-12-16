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
			plugin: {
				src: [
					'<%= projectOptions.src %>/open.js',
					'<%= projectOptions.src %>/resize.js',
					'<%= projectOptions.src %>/map.js',
					'<%= projectOptions.src %>/direction.js',
					'<%= projectOptions.src %>/hash.js',
					'<%= projectOptions.src %>/scrollTo.js',
					'<%= projectOptions.src %>/trigger.js',
					'<%= projectOptions.src %>/checkKey.js',
					'<%= projectOptions.src %>/setup.js',
					'<%= projectOptions.src %>/close.js'
				],
				dest: '<%= projectOptions.src %>/jquery.ascensor.js'
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
					mangle: false,
					preserveComments: true
				},
				files: {
					'<%= projectOptions.dist %>/jquery.ascensor.js' : ['<%= projectOptions.src %>/jquery.ascensor.js']
				}
			},
			
			ascensormin: {
				src: '<%= projectOptions.src %>/jquery.ascensor.js',
				dest: '<%= projectOptions.dist %>/jquery.ascensor.min.js'
			},
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
			after:{
				src: ["src/jquery.ascensor.js"]
			},
		},
		
		watch: {
			plugin:{
				files: ['src/**/*.js', '!src/jquery.ascensor.js'],
				tasks: ['build']
			},	
			examples:{
				files: ['examples/example_layout.ejs', 'Gruntfile.js'],
				tasks: ['template']
			},		
		},
		
		template: {
			simple: {
				src: 'examples/example_layout.ejs',
				dest: 'examples/example_simple.html',
				variables: {
					title: 'Simple',
					params:''
				}
			},
			
			horizontal: {
				src: 'examples/example_layout.ejs',
				dest: 'examples/example_horizontal.html',
				variables: {
					title: 'Horizontal',
					params:'{direction:"x"}'
				}
			},
			
			chocolat: {
				src: 'examples/example_layout.ejs',
				dest: 'examples/example_chocolat.html',
				variables: {
					title: 'Chocolat',
					params:'{direction: [[0,0],[0,1],[0,2],[1,2],[1,3],[1,4],[2,4],[2,5]]}'
				}
			},
			
			urlcontrole: {
				src: 'examples/example_layout.ejs',
				dest: 'examples/example_url.html',
				variables: {
					title: 'Chocolat',
					params:'{ascensorFloorName:["Home", "Implementation", "HTML" , "Jquery" , "CSS", "Smartphone", "End", "Yaaay"]}'
				}
			},
			
			queued: {
				src: 'examples/example_layout.ejs',
				dest: 'examples/example_chocolat_queued.html',
				variables: {
					title: 'Chocolat',
					params:'{direction: [[0,0],[0,1],[0,2],[1,2],[3,0],[5,0],[6,0],[2,5]], queued:"x"}'
				}
			},
			
			jump: {
				src: 'examples/example_layout.ejs',
				dest: 'examples/example_chocolat_jump.html',
				variables: {
					title: 'Chocolat',
					params:'{jump: true, direction: [[0,0],[0,2],[0,4],[2,4],[4,4],[6,7],[1,9],[1,5]]}'
				}
			},
			
			jump_loop: {
				src: 'examples/example_layout.ejs',
				dest: 'examples/example_chocolat_jump_loop.html',
				variables: {
					title: 'Chocolat',
					params:'{jump: true, loop:true, direction: [[0,0],[0,2],[0,4],[2,4],[4,4],[6,7],[1,9],[1,5]]}'
				}
			},
			
			loop: {
				src: 'examples/example_layout.ejs',
				dest: 'examples/example_chocolat_loop.html',
				variables: {
					title: 'Chocolat',
					params:'{loop: true, direction: [[0,0],[0,1],[0,2],[1,0],[1,1],[1,2],[2,0],[2,1]]}'
				}
			},
			
			loop_x: {
				src: 'examples/example_layout.ejs',
				dest: 'examples/example_chocolat_loop_x.html',
				variables: {
					title: 'Chocolat',
					params:'{loop: "loop-x", direction: [[0,0],[0,1],[0,2],[1,0],[1,1],[1,2],[2,0],[2,1]]}'
				}
			},
			
			loop_y: {
				src: 'examples/example_layout.ejs',
				dest: 'examples/example_chocolat_loop_y.html',
				variables: {
					title: 'Chocolat',
					params:'{loop: "loop-y", direction: [[0,0],[0,1],[0,2],[1,0],[1,1],[1,2],[2,0],[2,1]]}'
				}
			},
			
			increment: {
				src: 'examples/example_layout.ejs',
				dest: 'examples/example_chocolat_loop_increment.html',
				variables: {
					title: 'Chocolat',
					params:'{loop: "increment", direction: [[0,0],[0,1],[0,2],[1,0],[1,1],[1,2],[2,0],[2,1]]}'
				}
			},
			
			increment_y: {
				src: 'examples/example_layout.ejs',
				dest: 'examples/example_chocolat_loop_increment-y.html',
				variables: {
					title: 'Chocolat',
					params:'{loop: "increment-y", direction: [[0,0],[0,1],[0,2],[1,0],[1,1],[1,2],[2,0],[2,1]]}'
				}
			},
			
			increment_x: {
				src: 'examples/example_layout.ejs',
				dest: 'examples/example_chocolat_loop_increment-x.html',
				variables: {
					title: 'Chocolat',
					params:'{loop: "increment-x", direction: [[0,0],[0,1],[0,2],[1,0],[1,1],[1,2],[2,0],[2,1]]}'
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
		
		jasmine: {
			options: {
				'--web-security' : false,
				'--local-to-remote-url-access' : true,
				'--ignore-ssl-errors' : true
			},
			ascensor: {
				src: 'dist/jquery.ascensor.js',
				options: {
					vendor:[
						'http://code.jquery.com/jquery-2.0.0.min.js', 
						'components/jasmine-jquery/lib/jasmine-jquery.js',
						'test/spec/config.js'
					],
					specs: 'test/spec/*Spec.js'
				}
			},

			jquery2: {
				src: 'dist/jquery.ascensor.js',
				options: {
					vendor:[
						'http://code.jquery.com/jquery-2.0.0.min.js', 
						'components/jasmine-jquery/lib/jasmine-jquery.js',
						'test/spec/config.js'
					],
					specs: 'test/spec/*Spec.js'
				}
			},
			
			jquery19: {
				src: 'dist/jquery.ascensor.js',
				options: {
					vendor:[
						'http://code.jquery.com/jquery-1.9.0.min.js', 
						'components/jasmine-jquery/lib/jasmine-jquery.js',
						'test/spec/config.js'
					],
					specs: 'test/spec/*Spec.js'
				}
			},
			
			jquery18: {
				src: 'dist/jquery.ascensor.js',
				options: {
					vendor:[
						'http://code.jquery.com/jquery-1.8.0.min.js', 
						'components/jasmine-jquery/lib/jasmine-jquery.js',
						'test/spec/config.js'
					],
					specs: 'test/spec/*Spec.js'
				}
			},
			
			jquery17: {
				src: 'dist/jquery.ascensor.js',
				options: {
					vendor:[
						'http://code.jquery.com/jquery-1.7.0.min.js', 
						'components/jasmine-jquery/lib/jasmine-jquery.js',
						'test/spec/config.js'
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
	grunt.loadNpmTasks('grunt-contrib-copy');
	
	grunt.registerTask('default', ['jshint']);
	
	grunt.registerTask('build', [
		'clean:dist',
		'concat:plugin',
		'jshint:ascensor',
		'uglify:ascensor',
		'uglify:ascensormin',
		'clean:after',
		'jasmine',
	]);
	
};