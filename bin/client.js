
var NodeFlowClient = require('../lib/nodeflow-hook-client.js').NodeFlowClient;

var NodeFlowClient = new NodeFlowClient({
  name: "node-hook-client",
  debug: false,
  silent: false  
});

NodeFlowClient.start();