


	var   net 			= require( "net" )
		, Server 		= require( "./Server" )
		, Connection 	= require( "./Connection" );



	module.exports = {
		  Server: 		Server
		, Connection: 	Connection
		, isIP: 		net.isIP.bind( net )
		, isIPv4: 		net.isIPv4.bind( net )
		, isIPv6: 		net.isIPv6.bind( net )
	};