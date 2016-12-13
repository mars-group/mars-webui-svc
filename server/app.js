var connect = require('connect');
var serveStatic = require('serve-static');

connect().use(serveStatic('./dist')).listen(8080, function () {
  console.log('Server running on port 8080 in production mode ...');
});
