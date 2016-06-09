'use strict';

var os = require('os');
var request = require('superagent');

module.exports = {
  register: function () {
    //Register at EUREKA
    request.post('http://eureka:8080/eureka/v2/apps/frontend')
      .set('Content-Type', 'application/xml')
      .send(
        '<?xml version=\'1.0\' encoding=\'utf-8\'?>' +
        '<instance>' +
        '  <hostName>' + os.hostname() + '</hostName>' +
        '  <app>frontend</app>' +
        '  <ipAddr></ipAddr>' +
        '  <vipAddress></vipAddress>' +
        '  <secureVipAddress></secureVipAddress>' +
        '  <status>UP</status>' +
        '  <port>8080</port>' +
        '  <securePort>8080</securePort>' +
        '  <dataCenterInfo>' +
        '    <name>MyOwn</name>' +
        '  </dataCenterInfo>' +
        '</instance>'
      ).end(function (regErr, regRes) {

      if (regErr) {
        console.log('REGISTER ERROR: ', regErr);
        return false;
      }

      console.log('Successfully registered at Eureka');

      setInterval(function () {
        sendHeartBeatToEureka();
      }, 20000);
    });
  }
};

//Send heartbeat to EUREKA
var sendHeartBeatToEureka = function () {
  request.put('http://eureka:8080/eureka/v2/apps/frontend/' + os.hostname()).end(function (regErr, regRes) {
    if (regErr) {
      console.log('REGISTER ERROR: ', regErr);
    }
  });
};
