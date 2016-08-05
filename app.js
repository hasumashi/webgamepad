#!/usr/bin/env node
var config = require('./config');
//var port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
//var ipaddr = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";

var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

var logger = require('morgan');
var debug = require('debug')('http');
///var shortid = require('shortid');
///var crypto = require('crypto');
///crypto.randomBytes(3).toString('hex')
var qr = require('qr-image');
var device = require('express-device');

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(device.capture());

function sendQrImage(res, text) {
	res.status(200);
	res.contentType('png');
	///res.writeHead(200, { 'Content-Type': 'image/png' });
	var qr_svg = qr.image(text, {
		type: 'png',
		size: 8,
		margin: 0
	});
	qr_svg.pipe(res);
	res.on('finish', function() {
		res.end();
	});
}

/* routes */
app.get('/', function(req, res) {
	var device = req.device.type;
	if (device === 'phone' || device === 'tablet')
		res.redirect('/mobile');
		///res.sendFile(__dirname + '/public_mobile/index.html');
	else
		res.sendFile(__dirname + '/public/index.html');
});

app.get('/connect', function(req, res) {
	res.sendFile(__dirname + '/public/connect-full.html');
});

app.use(express.static(__dirname + '/public'));
app.use('/mobile', express.static(__dirname + '/public_mobile'));

app.get('/qr/random', function(req, res) {
	sendQrImage(res, Math.random().toString(36).slice(2,7));
});

/*app.get('/qr/:text', function(req, res) {
	sendQrImage(res, req.params.text);
});*/

app.get('/qr/:url/:pin', function(req, res) {
	sendQrImage(res, req.params.url + '/' + req.params.pin);
});

app.get('/:pin', function(req, res) {
	var pin = req.params.pin;
	//debug(io.sockets.adapter.rooms);
	
	if (pin in io.sockets.adapter.rooms) {
		debug('Pair request for PIN:', pin);
		//res.send('<h1>Connecting with PIN: <em>' + pin + '</em></h1>');
		res.render('game', { pin: pin })
		io.to(pin).emit('paired', pin);
	} else {
		res.redirect('/');
		///res.end();
	}
});

app.get('/api/config', function(req, res) {
  res.send('var config = ' + JSON.stringify(config));
});

/* socket.io */
io.on('connection', function(socket){
	debug('A user connected');
	
	socket.on('get-pin', function() {
		var pin = Math.random().toString(36).slice(2,7);
		socket.join(pin);
		
		debug('Generated PIN for: ' + socket.id);
		socket.emit('generated', pin);
	});
	
	socket.on('connect-with', function(pin) {
		debug('Socket '+socket.id+' joined room '+pin);
		socket.join(pin);
	});
	
	socket.on('motion', function(motionEvent) {
		///debug('Device moved');
		///debug(io.sockets.adapter.rooms);
		
		var room = Object.keys(socket.rooms)[1];
		socket.broadcast.in(room).emit('motion', motionEvent);
	});

    socket.onclose = function(reason) {
        var room = Object.keys(socket.rooms)[1];
        io.in(room).emit('connection-lost');
        Object.getPrototypeOf(this).onclose.call(this, reason);
    }
	
	socket.on('disconnect', function(){
		debug('User disconnected %s', socket.id);
		
		/*Object.keys(connections).forEach(function (key) {
			if (connections[key] === socket.id) {
				delete connections[key];
				debug('Deleted entry from connections: PIN "'+key+'"');
			}
		});
		debug('Finished cleaning up');*/
	});
});


server.listen(port, ipaddr, function() {
	console.log('Listening on %s port %s...', ipaddr, port);
});


/* error handling */
// catch 404 and forward to error handler
/*app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});*/

// development error handler
/*if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.write
  });
}*/

// production error handler
/*app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});*/
