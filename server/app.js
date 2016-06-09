var connect = require('connect');
var serveStatic = require('serve-static');
var eureka = require('./components/eureka');

connect().use(serveStatic(__dirname + '/build')).listen(8080, function () {
  console.log('Server running on port 8080 in production mode ...');

  eureka.register();
});
