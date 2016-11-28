var socket = io();
var pin = window.location.pathname.slice(1);
socket.emit('connect-with', pin);

socket.on('connection-lost', function() {
	alert('Connection lost!');
});

data = {
	x: 0,
	y: 0,
	z: 0,
	btnA: false,
	btnB: false
};

$(document).ready(function(){
	$('#buttonA').bind('touchstart', function(){
		//navigator.vibrate(30);
		$(this).addClass('active');
		
		data.btnA = true;
		socket.emit('motion', data);
	});
	
	$('#buttonB').bind('touchstart', function(){
		//navigator.vibrate(30);
		$(this).addClass('active');
		
		data.btnB = true;
		socket.emit('motion', data);
	});

	$('#buttonA').bind('touchend', function(){
		//navigator.vibrate(0);
		$(this).removeClass('active');
		
		data.btnA = false;
		socket.emit('motion', data);
	});
	
	$('#buttonB').bind('touchend', function(){
		//navigator.vibrate(0);
		$(this).removeClass('active');
		
		data.btnB = false;
		socket.emit('motion', data);
	});
});

window.addEventListener('deviceorientation', function (e) {
	//if (android and event.gamma > 180) event.gamma -= 360
	data.x = e.beta
	data.y = e.gamma
	data.z = e.alpha
	socket.emit('motion', data);
	
	//$('#score').text(data.score);
});
