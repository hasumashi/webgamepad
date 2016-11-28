$(document).ready(function(){

	$('a:not(.external)').onepage({
		target: 'main',
		transition: 'fade',
		query: {'onepage': 'true'},
		linkFormatter: function(link) {
			/**/$('h1.middle').removeClass('middle').delay(200).fadeOut(150, function() {
			/**/	$(this).text('Connect with your smartphone').fadeIn(150);
			/**/});
			
			link = link.split('/').pop().split('.');
			return link[0];
		}
	});
	
	var disconnAlert;
	socket = io();
	socket.on("generated", function(_pin) {
		pin = _pin;
		console.log("Generated PIN: "+pin);
		$('#pin-code').text(pin);
		$('#qr-img').attr('src', '/qr/' + config.domain + '/' + pin);
	});
	
	socket.on("paired", function() {
		disconnAlert = new PrettyAlert({
			title: 'Connection lost',
			content: '\
				<img src="' + '/qr/' + config.domain + '/' + pin + '">\
				<p>\
					Scan this QR code to reconnect<br>\
					or open <em>lemaze.io/'+ pin +'</em> in your phone\
				</p>\
				<a href="connect" class="btn btn-small pa-close">Return to main page</a>'
		});
		
		if (typeof disconnAlert !== 'undefined') {
			disconnAlert.close();
		}
		$.fn.onepage.openLink('sensors.html');
	});
	socket.on('connection-lost', function() {
		disconnAlert.open();
	});

});
