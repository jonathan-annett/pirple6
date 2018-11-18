// return https certs and other options

var 
  
  path=require('path'),
  
  fs=require('fs'),
  
  readPem = function(cert) {
      return fs.readFileSync(path.join(__dirname,'../https/'+cert));
  },
  certs = function () {
	return {
				cert  : readPem('cert.pem'),
				key   : readPem('key.pem')
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
