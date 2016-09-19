(function () {
  'use strict';

  angular
    .module('marsApp')
    .controller('AgentController', AgentController);

  /** @ngInject */
  function AgentController() {
    var vm = this;
    vm.title = 'Agent Editor';


    vm.myTest = { title : "World"};

    vm.testAgent = {
      name: "MarulaTree",
      id:"d57ed031-faa2-4f53-8833-098b8e318478",
      groupId:"ARS AfricaE",
      privacy:"group-private",
      parentType:"",
      stateVariables:[
        {
          type:"int",
          name:"myInt1",
          enumValues:[
            "option 1",
            "option 2"
          ],
          default:{
            mode:"code",
            expression:"1.5"
          },
          externallyInitialized:false
        }
      ],
      agentLogic:"",
      activeActions:[],
      passiveActions:[]
    };

    vm.currentAgent = vm.testAgent;

    vm.loadAgentFromJson = function () {

    }

  }
})();
