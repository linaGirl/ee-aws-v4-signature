	( function(){




		var   crypto  		= require( "crypto" )
			, urlparser 	= require( "url" );


		var hmac = function( key, data ){
			var h = crypto.createHmac( "SHA256", key );
			h.update( data );
			return new Buffer( h.digest( "base64" ), "base64" );
		}


		var encodeQueryString = function( qs ){
			if ( !qs ) return "";
			var keys = Object.keys( qs ), result = [];
			keys.sort();
			for( var i = 0, l = keys.length; i < l; i++ ) result.push( encodeURIComponent( keys[ i ] ) + "=" + encodeURIComponent( qs[ keys [ i ] ] ) );
			return result.join( "&" );
		}


		var encodeHeaders = function( headers, url ){
			var keys = Object.keys( headers ), h = {}, i = keys.length;
			while( i-- ) {
				h[ keys[ i ].toLowerCase() ] = headers[ keys[ i ] ];
				if ( keys[ i ].toLowerCase() === "date" ) h[ keys[ i ].toLowerCase() ] = formatDate( headers[ keys[ i ] ] );
			}
			h.host = url.hostname;

			var k = Object.keys( h ), result = [];
			k.sort();
			for( var i = 0, l = k.length; i < l; i++ ) result.push( k[ i ] + ":" + removeExcessSpace( h[ k[ i ] ] ) );

			return { canonical: result.join( "\n" ) + "\n", list: k.join( ";" ) };
		}


		var removeExcessSpace = function( data ){
			return ( data.indexOf( '"' ) === -1 ) ? data.replace( /\s{2,}/g, " " ).trim() : data.trim();
		}


		var sha256 = function( payload ){
			payload = payload || "";
			var h = crypto.createHash( "SHA256" );
			h.update( payload );
			return h.digest( "hex" );
		}


		// ISO8601 Basic format
		var formatDate = function( date ){
			return date.toISOString().replace( /\.[0-9]{1,3}Z/g, "Z" ).replace( /[\.:-]/g, "" );
		}

		var idDate = function( input ){
			return (typeof(a)==='date')?true:(typeof(a)==='object')?a.constructor.toString().match(/date/i)!==null:false; 
		}


		module.exports = function( data ){
			if ( !data.url ) 		throw new Error( "missing attribute url" );
			if ( !data.method ) 	throw new Error( "missing attribute method" );
			if ( !data.version ) 	throw new Error( "missing attribute version" );
			if ( !data.key ) 		throw new Error( "missing attribute key" );
			if ( !data.secret ) 	throw new Error( "missing attribute secret" );
			if ( !data.region ) 	throw new Error( "missing attribute region" );
			if ( !data.service ) 	throw new Error( "missing attribute service" );
			if ( !data.payload ) 	data.payload = "";
			if ( !data.headers ) 		throw new Error( "missing attribute headers" );
			if ( !data.headers.date ) 	throw new Error( "missing attribute headers.date" );
			if ( typeof data.headers.date !== "object" ) 	throw new Error( "attribute.headers.date must be typeof date!" );


			var   url 				= urlparser.parse( data.url )
				, headers 			= encodeHeaders( data.headers, url )
			 	, canonicalRequest	= [ data.method.toUpperCase(), url.pathname, encodeQueryString( data.query ), headers.canonical, headers.list, sha256( data.payload ) ]
			 	, requestSignature 	= sha256( canonicalRequest.join( "\n" ) )
			 	, signString 		= [ "AWS4-HMAC-SHA256", headers.canonical.date, data.version + "/" + data.region.toLowerCase() + "/" + data.service.toLowerCase() + "/aws4_request", requestSignature ].join( "\n" )
			 	, signature 		= hmac(hmac(hmac(hmac(hmac( "AWS4" + data.secret, data.version), data.region.toLowerCase().trim() ), data.service.toLowerCase().trim() ), "aws4_request" ), signString ).toString( "hex" );

			data.headers.date = formatDate( data.headers.date );

			return [ "AWS4-HMAC-SHA256 Credential=" + data.key + "/" + data.version + "/" + data.region.toLowerCase() + "/" + data.service.toLowerCase() + "/aws4_request", "SignedHeaders=" + headers.list, "Signature=" + signature ].join( ", " );
		}




	} )();

	