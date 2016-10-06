/**
 * Created by julius on 26.09.16.
 */

(function () {
  'use strict';
  angular
    .module('marsApp')

    .directive("stateVariableDirective", function () {

      var linkDing = function (scope, element, http) {


          scope.stateVariableTypes = ['float', 'double', 'string', 'enum', 'boolean', 'int'],

          scope.addStateVariable = function () {
            console.log('Button click executed');
            scope.agentStateVariables.push({
              type: "int",
              name: "juliusInt",
              enumValues: [],
              default: {mode: "code", expression: "hello"},
              externallyInitialized: true
            });
          },

            scope.removeStateVariable = function (key) {
              console.log('State Variable deleted',key)
              scope.agentStateVariables.splice(0,1);
              console.log(scope.agentStateVariables);
            },

          scope.getInfos = function (http) {

          }
      };

      return {
        restrict: 'AE',
        scope: {
          agentStateVariables: '=',
          addStateVariable: '&'
        },
        templateUrl: 'app/modeling/agents/templates/agentStateVariables.html',
        link: linkDing
      }
    });
})();
