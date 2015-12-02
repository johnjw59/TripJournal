// Karma configuration
// Generated on Thu Nov 19 2015 00:05:52 GMT-0800 (Pacific Standard Time)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: [
    //Angular source
    '../mocks/*.js',
    'lib/ionic/js/ionic.bundle.js',
    'lib/angular-mocks/angular-mocks.js',
    'lib/jsSHA/src/sha.js',
    'lib/ng-twitter-api/dist/ng-twitter-api.min.js',
    'lib/angular-resource/angular-resource.js',
    'lib/ngCordova/dist/ng-cordova.min.js',
    'lib/ngCordova/dist/ng-cordova-mocks.min.js',
    'lib/ngmap/build/scripts/ng-map.min.js',
    'lib/angularjs-google-places/dist/angularjs-google-places.min.js',
    'lib/angularjs-slider/dist/rzslider.js',

    //App code
    'app.js',
    'pages/*/*.js',
    'components/*/*.js',
    'services/*.js',

    //Test files
    '**/*.spec.js'
    ],

    // list of files to exclude
    exclude: [
      'karma.conf.js'
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      // source files, that you wanna generate coverage for
      // do not include tests or libraries
      // (these files will be instrumented by Istanbul)
      './pages/**/!(*spec).js': ['coverage'],
      './components/**/!(*spec).js': ['coverage'],
      './services/**/!(*spec).js': ['coverage']
    },

    // optionally, configure the reporter
    coverageReporter: {
      type : 'html',
      dir : 'coverage/'
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'coverage'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],

    phantomjsLauncher: {
      // Have phantomjs exit if a ResourceError is encountered (useful if karma exits without killing phantom)
      exitOnResourceError: true
    },


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultanous
    concurrency: Infinity
  });
};
