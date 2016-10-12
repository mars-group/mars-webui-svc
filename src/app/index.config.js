(function () {
  'use strict';

  angular
    .module('marsApp')
    .config(config);

  /** @ngInject */
  function config($provide, $logProvider) {
    // Enable log
    $logProvider.debugEnabled(true);


    /**
     * show actual line number on $log
     * https://stackoverflow.com/questions/20738707/angularjs-log-show-line-number
     */
    $provide.decorator('$log', function ($delegate) {
      var originalFns = {};

      // Store the original log functions
      angular.forEach($delegate, function (originalFunction, functionName) {
        originalFns[functionName] = originalFunction;
      });

      var functionsToDecorate = ['debug', 'error', 'info', 'log', 'warn'];

      // Apply the decorations
      angular.forEach(functionsToDecorate, function (functionName) {
        $delegate[functionName] = logDecorator(originalFns[functionName]);
      });

      return $delegate;
    });
  }

  function logDecorator(fn) {
    return function () {

      var args = [].slice.call(arguments);

      // Insert a separator between the existing log message(s) and what we're adding.
      args.push(' - ');

      // Use (instance of Error)'s stack to get the current line.
      var newErr = new Error();

      // phantomjs does not support Error.stack and falls over so we will skip it
      if (typeof newErr.stack !== 'undefined') {
        var stack = newErr.stack.split('\n').slice(1);

        if (navigator.userAgent.indexOf("Chrome") > -1) {
          stack.shift();
        }
        stack = stack.slice(0, 1);

        var stackInString = stack + '';
        var splitStack;
        if (navigator.userAgent.indexOf("Chrome") > -1) {
          splitStack = stackInString.split(" ");
        } else {
          splitStack = stackInString.split("@");
        }
        var lineLocation = splitStack[splitStack.length - 1];
        // Put it on the args stack.
        args.push(lineLocation);

        // Call the original function with the new args.
        fn.apply(fn, args);
      }
    };
  }

})();
