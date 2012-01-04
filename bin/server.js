

var NodeFlowServer = require('../lib/nodeflow-hook-server.js').NodeFlowServer;

var NodeFlowServer = new NodeFlowServer({
  name: "nodeflow-server",
  debug: false,
  address: "10.8.3.100",
  serverport: "6633",
  silent: true
});

NodeFlowServer.start();
