$(document).ready(function(){

	/**/var url = 'http:%2F%2F192.168.0.100:8080'

	$('a:not(.external)').onepage({
		target: '#content',
		transition: 'fade',
		linkFormatter: function(link) {
			/**/$('h1.middle').removeClass('middle').delay(200).fadeOut(150, function() {
			/**/	$(this).text('Connect with your smartphone').fadeIn(150);
			/**/});
			
			link = link.split('/').pop().split('.');
			return link[0];
		}
	});
	
	socket = io();
	socket.on("generated", function(pin) {
		console.log("Generated PIN: "+pin);
		$('#pin-code').text(pin);
		$('#qr-img').attr('src', '/qr/'+url+'%2F' + pin);
	});
	socket.on("paired", function() {
		$.fn.onepage.openLink('sensors.html');
	});
	socket.on('connection-lost', function() {
		alert('Connection lost!');
	});

});
