module.exports = function (grunt) {

  // load the task 
  grunt.loadNpmTasks("grunt-ts");

  // Configure grunt here
  grunt.initConfig({
    ts: {
      build: {
        src: ["src/**/*.ts"],
        out: "./Dimension.js",
        watch: "src"
      }
    }
  })
}
