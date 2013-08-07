

	var sign = require( "./" );


	console.log( sign( {		  
		  url: 		"http://iam.amazonaws.com/"
		, key: 		"AKithisisverywhatever"
		, secret: 	"wJalrXUtnFEMI/K7MDENG+bPxRfiCYEXAMPLEKEY"
		, region: 	"us-east-1"
		, method: 	"post"
		, service: 	"iam"
		, payload: 	"Action=ListUsers&Version=2010-05-08"
		, headers: {
			  "Content-type": 	"application/x-www-form-urlencoded; charset=utf-8"
			, date: 			new Date()
		} } ) );