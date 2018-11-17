// return https certs and other options

var certs = function () {
	var pem = require('fs').readFileSync;
	return {
				cert  : pem('./cert.pem'),
				key  : pem('./key.pem')
			 };
};

var environments = {

	staging : function () {
		return {
			envMode : 'staging',
			http : { port : 3000 },
			https  : { 
				port : 3001, 
				options : certs()
			}
		};
	},

	production : function() {
		return {
			envMode : 'production',
			http : { 
				port : 5000 
			},
			https  : { 
				port : 5001, 
				options : certs()
			}

		};
	}
};

var envMode = environments[process.env.NODE_ENV] || environments.staging;

module.exports = typeof envMode === 'function' ? envMode() : environments.staging();

if (process.mainModule===module) console.log({config:module.exports});
