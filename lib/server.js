

var NodeFlowServer = require('./nodeflow-hook-server.js').NodeFlowServer;

var NodeFlowServer = new NodeFlowServer({
  name: "nodeflow-server",
  debug: false,
  address: "10.8.3.119",
  serverport: "6633"
});

NodeFlowServer.start();