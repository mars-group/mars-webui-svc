'use strict';

const Eureka = require('eureka-js-client').Eureka;
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

const client = new Eureka({
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
    // eureka server host / port
    host: 'eureka',
    port: 8080,
    servicePath: '/eureka/apps/',
    fetchRegistry: true
  }
});

module.exports = {
  register: function () {

    setTimeout(function () {
      client.start();

      setInterval(function () {
        client.renew();
      }, 30000);
    },40000);

  }
};
