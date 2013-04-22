module.exports = function(grunt) {
	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		
		projectOptions:{
			src:"src",
			dist:"dist",
			deploy:"deploy"
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
			
			homepage:{
				src: '<%= projectOptions.deploy %>/homepage/src/js/plugins.js',
				dest: '<%= projectOptions.deploy %>/homepage/dist/js/plugins.js'
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
				tasks: ['jshint:ascensorsrc', 'clean', 'uglify']
			}
		},
		
		template: {
			simple: {
				src: 'examples/src/layout.ejs',
				dest: 'examples/example_simple.html',
				variables: {
					title: 'Simple',
					params:''
				}
			},
			
			horizontal: {
				src: 'examples/src/layout.ejs',
				dest: 'examples/example_horizontal.html',
				variables: {
					title: 'Horizontal',
					params:'{Direction:"x"}'
				}
			},
			
			chocolat: {
				src: 'examples/src/layout.ejs',
				dest: 'examples/example_chocolate.html',
				variables: {
					title: 'Chocolat',
					params:'{Direction:"chocolate", AscensorMap: "1|1 & 1|2 & 2|3 & 1|3 & 1|4 & 2|4 & 3|4"}'
				}
			},
			
			urlcontrole: {
				src: 'examples/src/layout.ejs',
				dest: 'examples/example_url.html',
				variables: {
					title: 'Chocolat',
					params:'{AscensorFloorName:"Home | Implementation | HTML | Jquery | CSS | Smartphone | End"}'
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
					'<%= projectOptions.deploy %>/homepage/dist/css/main.css': '<%= projectOptions.deploy %>/homepage/src/css/main.scss'
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
				src: './homepage',
				dest: './ascensor'
			}
		}
		
	});
	
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-templater');
	grunt.loadNpmTasks('grunt-ftp-deploy');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.registerTask('default', ['jshint']);
	grunt.registerTask('build', ['clean', 'jshint', 'uglify']);
	
	
	
	grunt.registerTask('deploy-github', ['template']);
	grunt.registerTask('deploy-kirkas', ['template:homepage', 'ftp-deploy']);
	
	
	
};