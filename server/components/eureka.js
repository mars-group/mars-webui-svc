(function () {
  'use strict';

  var Eureka = require('eureka-js-client').Eureka;
  var os = require('os');

  var ifaces = os.networkInterfaces();
  var ip = '127.0.0.1';


  Object.keys(ifaces).forEach(function (ifname) {
    var alias = 0;

    ifaces[ifname].forEach(function (iface) {
      if ('IPv4' !== iface.family || iface.internal !== false) {
        // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
        return;
      }

      if (iface.address) {
        ip = iface.address;
      }

      ++alias;
    });
  });

  var client = new Eureka({
    instance: {
      app: 'frontend',
      hostName: os.hostname(),
      ipAddr: ip,
      statusPageUrl: 'http://' + os.hostname() + ':3000',
      port: {
        '$': 3000,
        '@enabled': 'true'
      },
      vipAddress: 'frontend',
      dataCenterInfo: {
        '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
        name: 'MyOwn'
      }
    },
    eureka: {
      host: 'eureka',
      port: 8080,
      servicePath: '/eureka/apps/',
      fetchRegistry: true,
      maxRetries: 1000
    }
  });


  exports.register = function () {
    client.start();
  };

})();
