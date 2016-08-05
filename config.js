var Config = {
	// Contents of this file will be send to the client
	"domain":     process.env.OPENSHIFT_APP_DNS || '127.0.0.1',

	"serverIp":   process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1',
	"serverPort": process.env.OPENSHIFT_NODEJS_PORT || '8080',
	
	"clientPort": (process.env.OPENSHIFT_NODEJS_PORT) ? '8000':'8080',
	"protocol":   'wss://',
	"wsClientOpts": { transports: ['websocket'],
					  secure: true
					}
/*  "wsclientopts": { reconnection: true, 
										reconnectionDelay: 2000,
										reconnectionAttempts: 100,
										secure: false
									}*/

								 
};

module.exports = Config;

//adapted from: github.com/nodebooks/socketio-openshift-example
