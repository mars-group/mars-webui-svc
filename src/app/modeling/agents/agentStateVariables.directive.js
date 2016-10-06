/**
 * Created by julius on 26.09.16.
 */

(function () {
  'use strict';
  angular
    .module('marsApp')

    .directive("stateVariableDirective", function () {

      var linkDing = function (scope) {


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

          scope.removeStateVariable = function (agentName) {
            console.log('State Variable deleted', agentName)
            for (var i = 0; i < scope.agentStateVariables.length; i++) {
              if (scope.agentStateVariables[i].name === agentName) {
                scope.agentStateVariables.splice(i, 1);
              }
            }
            console.log(scope.agentStateVariables);
          }
      };

      return {
        restrict: 'AE',
        scope: {
          agentStateVariables: '=',
          openModal:'&'
        },
        templateUrl: 'app/modeling/agents/templates/agentStateVariables.html',
        link: linkDing
      }
    });
})();
