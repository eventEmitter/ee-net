

	var   Class 		= require( "ee-class" )
		, Options		= require( "ee-options" )
		, args 			= require( "ee-arguments" )
		, Events 		= require( "ee-event-emitter" )
		, type 			= require( "ee-types" )
		, net 			= require( "net" )
		, tls 			= require( "tls" )
		, log 			= require( "ee-log" )
		, JSONProtocol 	= require( "ee-protocol-json" );


	var   Connection 	= require( "./Connection" );



	module.exports = new Class( {
		inherits: Events

		, init: function( options ){
			var o = new Options( this, options );
			o( "port", "number", 0 );
			o( "host", "string" );
			o( "protocol", "function" );

			if ( !type.function( this.protocol ) ) this.protocol = JSONProtocol;
			
			if ( type.number( options.maxConnections ) ) this.maxConnections = options.maxConnections;

			if ( options.tls ) this.server = tls.createServer( options );
			else this.server = net.createServer( options );

			this.server.on( "listening", function(){ this.emit( "listening" ); }.bind( this ) );
			this.server.on( "close", function( err ){ this.emit( "close", err ); }.bind( this ) );
			this.server.on( "error", function( err ){ this.emit( "error", err ); }.bind( this ) );
			this.server.on( "connection", this.handleConnection.bind( this ) );

			this.close 				= this.server.close.bind( this.server );
			this.ref 				= this.server.ref.bind( this.server );
			this.unref 				= this.server.unref.bind( this.server );
			this.getConnections 	= this.server.getConnections.bind( this.server );
		}


		, get maxConnections(){
			return this.server.maxConnections;
		}

		, set maxConnections( num ){
			this.server.maxConnections = num;
		}

		, get address(){
			return this.server.address();
		}


		, handleConnection: function( connection ){
			this.emit( "connection", new Connection( { 
				  connection: 	connection
				, protocol: 	this.protocol 
			} ) );
		}


		, listen: function(){
			this.port = args( arguments, "port", this.port );
			this.host = args( arguments, "host", this.host );

			this.server.listen( this.port, this.host );

			return this;
		}

	} );