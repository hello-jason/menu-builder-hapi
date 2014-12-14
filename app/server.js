var port, start = new Date;

// require('sugar');

var fs        = require('fs'),
    server    = require('./lib/hapi'),
    app       = server.settings.app,
    env       = app.env,
    port_type = app.socket != null ? 'socket' : 'port';

require('./lib/process');

if (port_type === 'socket') {
  if (fs.existsSync(app.socket)) {
    fs.unlinkSync(app.socket);
  }

  port = app.socket;
} else {
  port = app.port;
}

server.connection({
  host: 'localhost',
  port: port
});

server.on('start', function(){
  if (app.socket) {
    // Allow nginx to read the socket file
    require('fs').chmod(app.socket, 0777);
  }

  var time = new Date - start;
  console.log(app.name + " started on " + port_type + " " + port + " (" + env + " mode) in " + time + "ms");
});

server.start();

module.exports = server;
