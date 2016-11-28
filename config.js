var os = require('os');
var dns = require('dns');

exports.load = function(callback) {
	dns.lookup(os.hostname(), function (err, ipAddr, fam) {
		if (err)
			ipAddr = '0.0.0.0';
			
		var port = process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || '8080';
		
		var Config = {
			// contents of this file will be send to the client
			"domain":     process.env.OPENSHIFT_APP_DNS || process.env.DOMAIN || ipAddr+':'+port, //'127.0.0.1',

			"serverIp":   process.env.OPENSHIFT_NODEJS_IP || process.env.IP_ADDR || ipAddr,
			"serverPort": port,
			
			"clientPort": (process.env.OPENSHIFT_NODEJS_PORT) ? '8000':'8080',
			"protocol":   'wss://',
			"wsClientOpts": { transports: ['websocket'],
							  secure: true
							}
		};

		callback(Config);
	});
};

// adapted from: github.com/nodebooks/socketio-openshift-example

/*"wsclientopts": { reconnection: true, 
					reconnectionDelay: 2000,
					reconnectionAttempts: 100,
					secure: false
}*/
