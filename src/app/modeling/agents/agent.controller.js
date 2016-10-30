(function () {
  'use strict';

  angular
    .module('marsApp')
    .controller('AgentController', AgentController);

  /** @ngInject */
  function AgentController($uibModal) {
    var vm = this;

    vm.openModalForNewStateVariable = function () {
      var settings={
        templateUrl: 'app/modeling/agents/stateVariableModal/newAgentStateVariableModal.html',
        controller: 'modalCtrl',
        controllerAs: 'modalController'
      };

      var modalInstance = $uibModal.open(settings);

      modalInstance.result.then(vm.addStateVariable());
    };

    vm.openStateVariableModal = function () {
      console.log(vm.currentAgent);
      console.log('openStateVariableModal()');
      var settings = {
        templateUrl: 'app/modeling/agents/stateVariableModal/newAgentStateVariableModal.html',
        controller: 'modalCtrl',
        controllerAs: 'modalController'
      };

      var modalInstance = $uibModal.open(settings);

      modalInstance.result.then(function (stateVariable) {
        console.log('modal instance');
        console.log(stateVariable);
      })
    };

    vm.title = 'Agent Editor';

    vm.stateVariableTypes = ['float', 'double', 'string', 'enum', 'boolean', 'int'];

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
    };

    vm.removeStateVariable = function (agentName) {
      console.log('State Variable deleted', agentName)
      for (var i = 0; i < vm.currentAgent.stateVariables.length; i++) {
        if (vm.currentAgent.stateVariables[i].name === agentName) {
          vm.currentAgent.stateVariables.splice(i, 1);
        }
      }
      console.log(vm.currentAgent.stateVariables);
    };

    vm.addStateVariable = function () {
      console.log('Button click executed');
      vm.currentAgent.stateVariables.push({
        type: "int",
        name: "juliusInt",
        enumValues: [],
        default: {mode: "code", expression: "hello"},
        externallyInitialized: true
      });
    }
  }
})();
