


	var   Class 		= require( "ee-class" )
		, log 			= require( "ee-log" )
		, assert 		= require( "assert" )
		, message 		= { hi: "fabian" }
		, executed 		= false;



	var   net 			= require( "./" )
		, Server 		= net.Server
		, Connection 	= net.Connection;


	var srv = new Server().listen();
	srv.on( "connection", function( connection ){
		connection.on( "message", function( msg ){
			connection.send( msg );
		} );

	} );


	srv.on( "listening", function(){
		var c = new Connection( { port: srv.address.port } );
		c.on( "message", function( msg ){
			assert.deepEqual( msg, message, "message was not transmitted correctly!" )
			executed = true;
			process.exit();
		} );

		c.send( message );
	} );
	

	setTimeout( process.exit, 10000 );

	process.on( "exit", function(){
		assert.ok( executed, "client / server has failed, no data was transmitted!" )
	} );