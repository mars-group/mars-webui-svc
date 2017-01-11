(function () {
  'use strict';

  angular
    .module('marsApp')
    .factory('MissionCTL', function MissionCTL($http, $log) {
      var baseUrl = '/mcs/';


      return {
        getAllSimPlans: function (params, callback) {
          var request = {
            params: params
          };
          return $http.get(baseUrl+'simplan', request)
            .then(function(res){
              callback(res.data);
            })
            .catch(function errorCall(err){
              $log.error(err);
              callback({error: err});
            });
        },
        getAllSimRuns: function (params, callback) {
          var request = {
            params: params
          };
          return $http.get(baseUrl+'simrun', request)
            .then(function(res){
              callback(res.data);
            })
            .catch(function errorCall(err){
              $log.error(err);
              callback({error: err});
            });
        },
        createSimPlan: function (simPlanName, scenarioConfigId, resultConfigId, executionConfigId, callback) {
          var body = {
            Name: simPlanName,
            OwnerId: "1", // TODO: change in future!
            GroupId: "42", // TODO: change in future!
            ScenarioDescriptionId: scenarioConfigId,
            ResultConfigurationId: resultConfigId,
            ExecutionConfigurationId: executionConfigId
          };
          return $http.post(baseUrl+'simplan', body)
            .then(function(res){
              callback(res.data);
            })
            .catch(function errorCall(err){
              //$log.error(err);
              callback({error: err});
            });
        },
        startSimPlan: function (simPlanId, callback) {
          var body = {
            SimPlanId: simPlanId
          };
          return $http.post(baseUrl+'simrun', body)
            .then(function(res){
              callback(res.data);
            })
            .catch(function errorCall(err){
              //$log.error(err);
              callback({error: err});
            });
        }
      };

    });

})();
