module.exports = function (grunt) {

  // load the tasks
  grunt.loadNpmTasks("grunt-ts");
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Configure grunt here
  grunt.initConfig({
    ts: {
      dist: {
        src: ["src/_reference.ts", "src/data/**/*.ts"],
        out: "lib/dim.js",
        sourceMap: true,
        options: {
          declaration: true
        }
      },
      public: {
        src: ["public/src/_reference.ts"],
        out: ["public/dist/element.js"],
        sourceMap: true,
        options: {
          declaration: true
        }
      }
    },
    uglify: {
      options: {
        mangle: true
      },
      dist: {
        files: {
          'lib/dim.min.js': ['lib/dim.js']
        }
      },
      public: {
        files: {
          'public/dist/element.min.js': ['public/dist/element.js']
        }
      }
    },
    watch: {
      files: ["src/**/*.ts", "public/src/**/*.ts"],
      tasks: ["ts:dist", "uglify:dist", "ts:public", "uglify:public"]
    }
  });

  grunt.registerTask("dist", ["ts:dist", "uglify:dist"]);
  grunt.registerTask("public", ["ts:public", "uglify:public"]);
}
