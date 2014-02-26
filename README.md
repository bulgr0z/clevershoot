# Clevershoot

#### version 0.0

## About
Clevershoot is a small app designed to help photography professionals keeping track of what's been
done over a large amount of images. Clevershoot is based upon the wonderful [Sailsjs](https://github.com/balderdashy/sails/) framework.

Create an account, add a shooting and the corresponding jobs (ex: "Photography", "Photoshop", "Storage")
and invite some coworkers to work on the tasks you gave them.

Add some references and drop some images on them. Each image will list the jobs you defined, allowing your coworkers'
to toggle their respective tasks status. Never wonder about your project's state ever again.

## Install
You will need a Mongodb database, a Redis store, a Mandrill apikey to send invitation emails and some nodejs-fu.

#### 1 - Clone the repo
	$ git clone git@github.com:bulgr0z/clevershoot.git
	
#### 2 - Configure
You will need to add two files in /config/ : connections.js & local.js
##### /config/connections.js
	module.exports.connections = {

		localDiskDb: {
			adapter: 'sails-disk'
		},

		clevershootMongo: function(){

		  // Assume a default local mongo database in development
		  if (process.env.NODE_ENV === 'development')
	    	return {
		    	adapter   : 'sails-mongo',
			  	host      : 'localhost',
			  	port      : 27017,
			  	user      : 'clevershoot',
			  	password  : 'clevershoot',
			  	database  : 'clevershoot'
	    	}

		  // Set up your production database credentials here
		  if (process.env.NODE_ENV === 'production')
			  return {
				adapter   : '',
				host      : '',
			  	port      : 27017,
			  	user      : '',
			  	password  : '',
			  	database  : ''
		  	}
		}()
	};

##### /config/local.js

	module.exports = {
		 port: process.env.PORT || 1337,
		 mandrillApiKey: 'YOUR_MANDRILL_KEY',
		 environment: process.env.NODE_ENV || 'development'
	}
	
#### Install and start
	$ npm install
	$ node app

You should see your Clevershoot application up on localhost:1337.

<3 from kappuccino.