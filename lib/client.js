
var NodeFlowClient = require('./nodeflow-hook-client.js').NodeFlowClient;

var NodeFlowClient = new NodeFlowClient({
  name: "node-hook-client",
  debug: false,
  silent: true  
});

NodeFlowClient.start();