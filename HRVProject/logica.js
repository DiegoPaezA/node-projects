$(function() {
	function mostrar() {
		//crono.html((+crono.html() + 0.1).toFixed(1));
		tempo -= 1
        socket.emit('changeState', '{"state":6}');
		if (tempo == 0) {
			clearInterval(t);
			t = undefined;
			seconds.stop()
			
			$("#parar").addClass('disabled');
			window.location.href = "/circulo.html";
		}
		minutos = parseInt(tempo / 60);
		segundos = pad(parseInt(tempo % 60));
		dminutos.html(minutos);
		dsegundos.html(segundos);

		seconds.animate(segundos / 60, function() {
			seconds.setText(minutos + ":" + segundos);
		});

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
		$("#skip").addClass('disabled');

		t = setInterval(mostrar, 1000);
		// Emit message changing the state to 1
		socket.emit('changeState', '{"state":1}');
		// Change led status on web page to ON
		document.getElementById("outputStatus").innerHTML = "Status: ON";

	}

	function parar() {
		dminutos.html("5");
		dsegundos.html("00");
		seconds.stop()
		seconds.set(1)
		seconds.setText("5:00");
		tempo = 300;
		$("#parar").addClass('disabled');
		$("#arrancar").removeClass('disabled');
		$("#skip").removeClass('disabled');
		clearInterval(t);
		t = undefined;
		// Emit message changing the state to 0
		socket.emit('changeState', '{"state":0}');
		// Change led status on web page to OFF
		document.getElementById("outputStatus").innerHTML = "Status: OFF";
	}

	var t, dminutos = $("#minutos"),
		dsegundos = $("#segundos");
	var tempo = 300;
	var minutos, segundos

	var seconds = new ProgressBar.Circle('#progress', {
		duration: 200,
		color: "#6FD57F",
		trailColor: "#ddd",
		strokeWidth: 3,
		trailWidth: 1,
	});

	seconds.set(1)
	seconds.setText("5:00");
	var socket = io.connect();
	socket.emit('changeState', '{"state":4}');
	socket.on('showRR', function(data) {
		//console.log("client receve rr: " + data);
		document.getElementById("outputStatus").innerHTML = "rr: " + String(data);
	});
	$("#arrancar").on("click", arrancar);


});