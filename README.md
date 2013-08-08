#ee-aws-v4-signature

sign REST request for the following services

- Amazon CloudSearch
- Amazon CloudWatch
- Amazon DynamoDB
- Amazon Elastic Transcoder
- Amazon Glacier
- Amazon Redshift
- Amazon Relational Database Service
- Amazon Simple Queue Service
- Auto Scaling
- AWS CloudFormation
- AWS Data Pipeline
- AWS Elastic Beanstalk
- AWS Identity and Access Management
- AWS Security Token Service
- Elastic Load Balancing


# install

npm install ee-aws-v4-signature

# usage

	var sign = require( "ee-aws-v4-signature" );

	var signature = sign( {		  
		  url: 		"http://iam.amazonaws.com/"
		, key: 		"AKithisisverywhatever"
		, secret: 	"wJalrXUtnFEMI/K7MDENG+bPxRfiCYEXAMPLEKEY"
		, region: 	"us-east-1"
		, method: 	"post"
		, service: 	"iam"
		, version: 	"20120812"
		, payload: 	"Action=ListUsers&Version=2010-05-08"
		, headers: {
			  "Content-type": 	"application/x-www-form-urlencoded; charset=utf-8"
			, date: 			new Date()
		}
	} );