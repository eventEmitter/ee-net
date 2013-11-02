# ee-net

simple tcp client / server for easy json objects / data transmission supporting tls

## installation

	npm install ee-net ee-protocol-json


## build status

[![Build Status](https://travis-ci.org/eventEmitter/ee-net.png?branch=master)](https://travis-ci.org/eventEmitter/ee-net)


## usage

the Server && conenction class do have almost all properties & events of the native node.js «net» API. aee [net API](http://nodejs.org/docs/latest/api/net.html)

### server

#### constructor

the constructor of the server class takes the parameters described at [tls.createServer](http://nodejs.org/docs/latest/api/tls.html#tls_tls_createserver_options_secureconnectionlistener) for a tls enabled server and the parameters described at [net.createServer](http://nodejs.org/docs/latest/api/net.html#net_net_createserver_options_connectionlistener) for non tls mode. you may pass a port and a host parameter as well.

	var net = require( "ee-net" );

	var server = new net.Server( { port: 9999 } );

#### «connection» event

the connection event is called when a client has established a new connection on the server

	server.on( "connection", function( connection ){
		// see the «connection» chapter below for the docs on connections
	} );


### connection

#### constructor

the constructor of the connection class takes the options described at [tls.connect](http://nodejs.org/docs/latest/api/tls.html#tls_tls_connect_port_host_options_callback) for tls enabled connections and the parameters port and host for non tls connections.

	var connection = new net.Connection( { host: 10.0.1.2, port: 9999 } );

#### «message» event

the message event is called when a message was received and decoeded successfully

	connection.on( "message", function( message ){
		log( message );
	} )

#### send method

you may transmit messages using the «send» method

	connection.send( { myJSON: "object" } );

#### remote / local property

the remote and local property return the remote / local configuration

	log( connection.remote ); // { address: 10.0.1.2, family: "IPv4", port: 9999 }


### example of a super simple echo server running on localhost

	var   net 			= require( "ee-net" )
		, server 		= new net.Server().listen();


	server.on( "conenction", function( connection ){
		connection.on( "message", function( msg ){
			log( msg );  // { hi: "fabian" }
			connection.send( msg );
		} );
	} );

	// wait until the server is online so we know its port
	server.on( "listening", function(){
		var client = new Connection( { 
			port: server.address.port
		} );

		client.on( "message", function( msg ){
			log( msg ); // { hi: "fabian" }
		} );

		client.send( { hi: "fabian" } );
	} );


### cutom protocol implementation

you may implement custom protocol handlers, see [ee-protocol-json](https://npmjs.org/package/ee-protocol-json) for more information. you may pass it to the constructors of the Server / Connection using the «protocol» property of the options object.