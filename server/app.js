var connect = require('connect');
var serveStatic = require('serve-static');
var eureka = require('./components/eureka');

connect().use(serveStatic('./dist')).listen(3000, function () {
  console.log('Server running on port 3000 in production mode ...');

  eureka.register();
});
