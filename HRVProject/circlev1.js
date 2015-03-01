$(function() {
	//code
	function mostrar() {
		//crono.html((+crono.html() + 0.1).toFixed(1));
		tempo -= 1;
		socket.emit('changeState', '{"state":6}');
		if (tempo === 0) {
			parar()
			clearInterval(t);
			t = undefined;
			socket.emit('changeState', '{"state":0}');
			window.location.href = "resultados.html";
		}
		minutos = parseInt(tempo / 60);
		segundos = pad(parseInt(tempo % 60));
		dminutos.html(minutos);
		dsegundos.html(segundos);

		//console.log("tempo: " + minutos + ":" + segundos );
	}

	function pad(val) {
		var valString = val + "";
		if (valString.length < 2) {
			return "0" + valString;
		} else {
			return valString;
		}
	}

	function arrancar() {

		$("#parar").removeClass('disabled');
		$("#parar").on("click", parar);

		$("#arrancar").addClass('disabled');
		t = setInterval(mostrar, 1000);
		tanimate = setInterval(function() {
			animateCircle(myCircle, canvas, context);
		}, 50);
		temp = 0;
		controlAnimate();
		socket.emit('changeState', '{"state":1}');
	}

	function parar() {
		dminutos.html("5");
		dsegundos.html("00");
		tempo = 300;
		controlRadio = 1;
		context.clearRect(0, 0, canvas.width(), canvas.height());
		console.log("Radius--" + myCircle.radius);
		myCircle.radius = (Math.sqrt((((canvas.width()) / 2)*((canvas.height()) / 2))/Math.PI)) - 40;
		drawCircle(myCircle, context);
		$("#parar").addClass('disabled');
		$("#arrancar").removeClass('disabled');
		clearInterval(t);
		t = undefined;
		clearInterval(tanimate);
		tanimate = undefined;
		clearTimeout(tou_in);
		clearTimeout(tou_hold);
		clearTimeout(tou_out);
		tou_in = undefined;
		tou_hold = undefined;
		tou_out = undefined;
		socket.emit('changeState', '{"state":0}');
		document.body.style.background = "#a6d8f1"; //change background color
	}

	function controlAnimate() {
		//code

		console.log(temp);
		if (temp === 0) {
			//code
			playSound();
			tou_in = setTimeout(function() {
				//console.log("Time off");
				controlRadio = 2;
				temp = 1;
				controlAnimate();
			}, 5000);
		} else if (temp == 1) {
			playSound();
			tou_hold = setTimeout(function() {
				//console.log("Time off");
				controlRadio = 3;
				temp = 2;
				controlAnimate();
			}, 2000);
		} else if (temp == 2) {
			playSound();
			tou_out = setTimeout(function() {
				//console.log("Time off");
				controlRadio = 4;
				temp = 0;
			}, 5000);
		}
	}


	function animateCircle(myCircle, canvas, context) {
		//code
		//console.log("control --" + controlRadio)
		context.clearRect(0, 0, canvas.width(), canvas.height());
		if (controlRadio == 1) {
			//code
			mensaje.html("Inhalar");
			myCircle.radius += 0.6;
			drawCircle(myCircle, context);
			//console.log("aumenta radio");
			document.body.style.background = "#a6d8f1"; //change background color
		} else if (controlRadio == 2) {
			//code
			mensaje.html("Mantener");
			//console.log("radio no aumenta");
			drawCircle(myCircle, context);
			document.body.style.background = "#FFBEA0"; //change background color
		} else if (controlRadio == 3) {
			//code
			mensaje.html("Exhalar");
			myCircle.radius -= 0.6;
			drawCircle(myCircle, context);
			//console.log("radio disminuye");
			document.body.style.background = "#EFE23E"; //change background color
		} else if (controlRadio == 4) {
			//code
			controlRadio = 1;
			//console.log("radio reinicia");
			controlAnimate();
		}

	}

	function drawCircle(myCircle, context) {
		context.beginPath();
		context.arc(myCircle.x, myCircle.y, myCircle.radius, myCircle.startAngle, myCircle.endAngle, myCircle.cC);
		context.fillStyle = '#FFFFFF';
		context.fill();
		context.lineWidth = myCircle.borderWidth;

	}

	var t, tanimate, dminutos = $("#minutos"),
		dsegundos = $("#segundos"),
		mensaje = $("#msn");
	var tou_in, tou_hold, tou_out;
	var tempo = 300,
		controlRadio = 1,
		temp = 0;
	var minutos, segundos;
	var canvas = $('#respondCanvas');
	var context = canvas.get(0).getContext('2d');
	var container = $(canvas).parent();

	var soundID = "Thunder";

	function loadSound() {
		createjs.Sound.registerSound("bep.mp3", soundID);
	}

	function playSound() {
		createjs.Sound.play(soundID);
	}

	canvas.attr('width', $(container).width()); //max width
	canvas.attr('height', $(container).height()); //max height

	var myCircle = {
		x: (canvas.width()) / 2,
		y: (canvas.height()) / 2,
		radius: (Math.sqrt((((canvas.width()) / 2)*((canvas.height()) / 2))/Math.PI)) - 40,
		startAngle: 0,
		endAngle: 2 * Math.PI,
		borderWidth: 1,
		cC: false
	};
	
	var socket = io.connect();
	socket.emit('changeState', '{"state":5}');
	socket.emit('changeState', '{"state":0}');
	socket.on('showRR', function(data) {
		//console.log("client receve rr: " + data);
		document.getElementById("outputStatus").innerHTML = "rr: " + String(data);
	});
	document.body.style.background = "#a6d8f1"; //change background color
	$("#arrancar").on("click", arrancar);
	$("#cuerpo").on("load", loadSound());
	window.addEventListener('load', drawCircle(myCircle, context), loadSound(), false);

});