// Example OpenFlow Controller written for Node.js
// Prototype to investiage eventing system handling of OF messages
// Author : Gary Berger, Cisco Systems, inc.
var net = require('net');
var sys = require('sys');
var util = require('util');
var Binary = require('binary');
var controller = require("./lib/OFController.js");
var pcap = require('pcap');

//var filter = "tcp port "+0x19e9                              
var filter = "tcp"                              

// pcap_session = pcap.createSession("","host Omnicron-XJ4.local and tcp port 6633"); 
pcap_session = pcap.createSession("", filter); 
//pcap_session = pcap.createSession(); 
sys.puts("Listening on " + pcap_session.device_name);   
pcap_session.on('packet', function (raw_packet) {
    var packet = pcap.decode.packet(raw_packet);
	//console.log("PACKET: " + packet.link.ip.tcp.dport) 
	 console.dir(packet.link.ip.tcp)

});
