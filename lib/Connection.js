

	var   Class 		= require( "ee-class" )
		, net 			= require( "net" )
		, tls 			= require( "tls" )
		, Events 		= require( "ee-event-emitter" )
		, type 			= require( "ee-types" )
		, log 			= require( "ee-log" )
		, JSONProtocol 	= require( "ee-protocol-json" );



	module.exports = new Class( {
		inherits: Events

		, init: function( options ){

			if ( type.object( options.connection ) ){
				// we got a connection from a server instance
				this.connection = options.connection;
			}
			else {
				// create a new connection
				if ( !type.function( options.protocol ) ) options.protocol = JSONProtocol;

				if ( options.tls ){
					this.connection = tls.connect( options );
				}
				else {
					this.connection = net.connect( options.port, options.host );
				}
			}

			// protocol handler
			this.incoming = new options.protocol( true );
			this.outgoing = new options.protocol();

			this.connection.pipe( this.incoming );
			this.outgoing.pipe( this.connection );

			// events
			this.connection.on( "connect", function(){ this.emit( "connect" ); }.bind( this ) );
			this.connection.on( "timeout", function(){ this.emit( "timeout" ); }.bind( this ) );
			this.connection.on( "close", function( err ){ this.emit( "close", err ); }.bind( this ) );

			this.incoming.on( "data", function( obj ){ this.emit( "message", obj ); }.bind( this ) );
			this.incoming.on( "end", function( err ){ this.emit( "end", err ); }.bind( this ) );
			this.incoming.on( "error", function( err ){ this.emit( "error", err ); }.bind( this ) );

			this.outgoing.on( "drain", function(){ this.emit( "drain" ); }.bind( this ) );
			this.outgoing.on( "error", function( err ){ this.emit( "error", err ); }.bind( this ) );

			// methods
			this.send 			= this.outgoing.write.bind( this.outgoing );

			this.destroy 		= this.connection.destroy.bind( this.connection );
			this.setTimeout 	= this.connection.setTimeout.bind( this.connection );
			this.setNoDelay 	= this.connection.setNoDelay.bind( this.connection );
			this.setKeepAlive 	= this.connection.setKeepAlive.bind( this.connection );
			this.unref 			= this.connection.unref.bind( this.connection );
			this.ref 			= this.connection.ref.bind( this.connection );
			this.end 			= this.connection.end.bind( this.connection );

			this.pause 			= this.incoming.pause.bind( this.incoming );
			this.resume 		= this.incoming.resume.bind( this.incoming );
		}

		, get local(){
			return this.connection.address();
		}

		, get remote(){
			return {
				  port:  	this.connection.remotePort
				, family: 	this.address.family
				, address: 	this.connection.remoteAddress
			};
		}

		, get bytesRead(){
			return this.connection.bytesRead;
		}

		, get bytesWritten(){
			return this.connection.bytesWritten;
		}


		, get bufferSize(){
			return this.connection.bufferSize;
		}

		, set bufferSize( num ){
			this.connection.bufferSize = num;
		}
	} );