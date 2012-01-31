
//Load NodeFlowServer Class
var NodeFlowServer = require('../lib/nodeflow-server.js').NodeFlowServer;

var ns = new NodeFlowServer();

ns.start("10.8.3.100", "6633");
