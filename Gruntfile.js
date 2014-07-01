module.exports = function (grunt) {

  // load the tasks
  grunt.loadNpmTasks("grunt-ts");
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Configure grunt here
  grunt.initConfig({
    ts: {
      cards: {
        src: "data/**/*.ts",
        watch: "data",
        outDir: "lib",
        sourceMap: false
      },
      dist: {
        src: "src/_reference.ts",
        out: "lib/dim.js",
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
      }
    },
    watch: {
      files: ["src/**/*.ts"],
      tasks: ["ts:dist", "uglify:dist"]
    }
  });

  grunt.registerTask("dist", ["ts:dist"]);
  grunt.registerTask("cards", ["ts:cards"]);
}
