module.exports = function(config) {
  config.set({

    basePath: '',

    frameworks: ['jasmine'],

    files: [{
        pattern: 'test/fixtures/**/*.html',
        served: true,
        included: false
      },
      'components/jquery/jquery.js',
      'components/jasmine-jquery/lib/jasmine-jquery.js',
      'dist/jquery.ascensor.js',
      'test/helpers/**/*Helper.js',
      'test/**/*Spec.js'
    ],

    preprocessors: [{
      'test/fixtures/**/*.html': ''
    }],

    reporters: ['progress', 'unicorn'],

    port: 9876,

    colors: true,

    logLevel: config.LOG_INFO,

    autoWatch: true,

    browserStack: {
      username: 'logalley',
      accessKey: '79nSOMotfVkd9AOVOcZY',
      startTunnel: true
    },

    customLaunchers: {
      android_old: {
        base: 'BrowserStack',
        os: 'android',
        os_version: '2.3',
        device: 'Samsung Galaxy S II'
      },
      android_latest: {
        base: 'BrowserStack',
        os: 'android',
        os_version: '4.1',
        device: 'Samsung Galaxy S III'
      },
      ios_6: {
        base: 'BrowserStack',
        device: 'iPhone 5',
        os: 'ios',
        os_version: '6.0'
      },
      ios_7: {
        base: 'BrowserStack',
        device: 'iPhone 5S',
        os: 'ios',
        os_version: '7.0'
      },
      IE_8: {
        base: 'BrowserStack',
        browser: 'ie',
        browser_version: '8.0',
        os: 'Windows',
        os_version: 'XP'
      },
      IE_9: {
        base: 'BrowserStack',
        browser: 'ie',
        browser_version: '9.0',
        os: 'Windows',
        os_version: '7'
      },
      IE_10: {
        base: 'BrowserStack',
        browser: 'ie',
        browser_version: 'latest',
        os: 'Windows',
        os_version: '8'
      },
    },

    browsers: ['Chrome', 'ChromeCanary', 'Firefox', 'Opera', 'Safari', 'PhantomJS'],
    captureTimeout: 60000,
    singleRun: true
  });
};