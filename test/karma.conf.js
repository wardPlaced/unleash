// Karma configuration
// http://karma-runner.github.io/0.12/config/configuration-file.html
// Generated on 2014-12-10 using
// generator-karma 0.8.3

module.exports = function(config) {
  'use strict';

  config.set({
    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // base path, that will be used to resolve files and exclude
    basePath: '../',

    // testing framework to use (jasmine/mocha/qunit/...)
    frameworks: ['mocha', 'sinon-chai'],

    // list of files / patterns to load in the browser
    files: [
      'bower_components/jquery/dist/jquery.js',
      'bower_components/lodash/dist/lodash.js',
      'bower_components/angular/angular.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'bower_components/angular-sanitize/angular-sanitize.js',
      'bower_components/angular-animate/angular-animate.js',
      'bower_components/angular-cookies/angular-cookies.js',
      'bower_components/angular-resource/angular-resource.js',
      'bower_components/angular-route/angular-route.js',
      'bower_components/angular-touch/angular-touch.js',
      'bower_components/angular-aria/angular-aria.js',
      'bower_components/angular-relative-date/angular-relative-date.js',
      'bower_components/angular-growl-2/build/angular-growl.js',
      'bower_components/angular-drag-and-drop-lists/angular-drag-and-drop-lists.js',
      'bower_components/angularjs-datepicker/dist/angular-datepicker.min.js',
      'bower_components/angular-local-storage/dist/angular-local-storage.min.js',
      'bower_components/angulartics/src/angulartics.js',
      'bower_components/angulartics-mixpanel/dist/angulartics-mixpanel.min.js',
      'app/scripts/**/*.js',
      'test/mock/**/*.js',
      'test/spec/**/*.js',

      // templates
      'app/views/**/*.html'
    ],

    // list of files / patterns to exclude
    exclude: [],

    // web server port
    port: 8080,

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: [
      'PhantomJS'
    ],

    // Which plugins to enable
    plugins: [
      'karma-mocha',
      'karma-sinon-chai',
      'karma-ng-html2js-preprocessor',
      'karma-phantomjs-launcher'
    ],

    preprocessors: {
      'app/views/**/*.html': ['ng-html2js']
    },

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false,

    colors: true,

    ngHtml2JsPreprocessor: {
      // strip app from the file path
      stripPrefix: 'app/'
   },

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO

    // Uncomment the following lines if you are using grunt's server to run the tests
    // proxies: {
    //   '/': 'http://localhost:9000/'
    // },
    // URL root prevent conflicts with the site root
    // urlRoot: '_karma_'
  });
};
