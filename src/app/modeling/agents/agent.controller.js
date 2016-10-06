(function () {
  'use strict';

  angular
    .module('marsApp')


    .controller('AgentController', AgentController);

  /** @ngInject */
  function AgentController($uibModal) {
    var vm = this;

    vm.openStateVariableModal = function () {
      console.log('openStateVariableModal()')
      var settings = {
        templateUrl: 'app/modeling/agents/stateVariableModal/newAgentStateVariableModal.html',
        controller: 'modalCtrl',
        controllerAs: 'modalController'
      };

      var modalInstance = $uibModal.open(settings);
    },


    vm.title = 'Agent Editor',

      vm.name = 'Hello World',

      vm.myTest = {title: "World"},

      vm.testAgent = {
        name: "MarulaTree",
        id: "d57ed031-faa2-4f53-8833-098b8e318478",
        groupId: "ARS AfricaE",
        privacy: "group-private",
        parentType: "",
        stateVariables: [
          {
            type: "float",
            name: "marulaFloat",
            enumValues: [
              "option 1",
              "option 2"
            ],
            default: {
              mode: "code",
              expression: "1.5"
            },
            externallyInitialized: false
          },
          {
            type: "int",
            name: "marulaInt",
            enumValues: [
              "option 1",
              "option 2"
            ],
            default: {
              mode: "code",
              expression: "10"
            },
            externallyInitialized: false
          },
          {
            type: "enum",
            name: "marulaEnum",
            enumValues: [
              "option 1",
              "option 2"
            ],
            default: {
              mode: "code",
              expression: "1.5"
            },
            externallyInitialized: true
          }
        ],
        agentLogic: "",
        activeActions: [],
        passiveActions: []
      };

    vm.currentAgent = vm.testAgent;

    vm.loadAgentFromJson = function () {
      console.log('loadAgentFromJSON')
    }

  }
})();
