//Loading modules
var http = require('http');
var fs = require('fs');
var path = require('path');
var b = require('bonescript');
var now = require("performance-now");
var fs = require("fs");
var PythonShell = require('python-shell');
var fse = require('fs-extra')
// Create a variable called led, which refers to P9_14
var led = "P9_11";
var inputPin = 'P9_24';
// Initialize the led as an OUTPUT
b.pinMode(led, b.OUTPUT);
b.pinMode(inputPin, b.INPUT);

// Initialize the server on port 8888
var server = http.createServer(function(req, res) {
	// requesting files
	var file = '.' + ((req.url == '/') ? '/index.html' : req.url);
	var fileExtension = path.extname(file);
	var contentType = 'text/html';
	// Uncoment if you want to add css to your web page

	if (fileExtension == '.css') {
		contentType = 'text/css';
	}
	fs.exists(file, function(exists) {
		if (exists) {
			fs.readFile(file, function(error, content) {
				if (!error) {
					// Page found, write content
					res.writeHead(200, {
						'content-type': contentType
					});
					res.end(content);
				}
			})
		} else {
			// Page not found
			res.writeHead(404);
			res.end('Page not found');
		}
	})
}).listen(8888);

// Loading socket io module
var io = require('socket.io').listen(server);
var swisr, temprr = 0,rrstart, rrend, rrvalue, pagselect;
// When communication is established
io.on('connection', function (socket) {
    socket.on('changeState', function(data) {
        var newData = JSON.parse(data);
        if( newData.state==2){
          //leer archivo rr e vector tempo
          var rrbasal = readrr("rrbasal")
          var rrtrain = readrr("rrtrain")
          socket.emit("plotHRV-1",rrbasal);
          socket.emit("plotHRV-2",rrtrain);
        } else { handleChangeState(newData.state); }
    });
});

// Change led state when a button is pressed
function handleChangeState(data) {
	
	console.log("LED = " + data);
	// turns the LED ON or OFF
	b.digitalWrite(led, data);
	if (data === 4) {
		pagselect = 1
		if(fs.existsSync('rrbasal.txt')===true){
		removefile("rrbasal")}
		if(fs.existsSync('rrtrain.txt')===true){
		removefile("rrtrain")}
	}
	if (data=== 5) {
		pagselect = 2
	}
	enableISR(data);
}

function enableISR(val) {


	if (val == 1) {
		console.log("ISR_on");
		swisr = 0;
		atach();
	} else if (val == 0) {
		console.log("ISR_off");
		detach();
		swisr = 0;
		temprr = 0;
	}

}

function interruptCallback(x) {

	if (swisr == 0) {
		//console.log("interrup inicializada");
		swisr = 1;
	} else if (swisr == 1) {
		//console.log("interrup push btn");
		if (temprr == 0) {
			rrstart = now();
			temprr = 1;
		} else if (temprr == 1) {
			rrend = now();
			rrvalue = rrend - rrstart;
			rrstart = rrend;
			if (pagselect === 1) {
				saverr("rrbasal", parseInt(rrvalue))
			} else if (pagselect === 2) {
				saverr("rrtrain", parseInt(rrvalue))
			}
			console.log("rr: " + parseInt(rrvalue) + "ms")
		}
		detach();
		setTimeout(atach, 100); //bouncetime
		swisr = 0;
	}

	//console.log("---------sw : " + swisr)

}

function readrr(filename) {
        var text = fs.readFileSync(String(filename)+'.txt','utf8')
        var datarr = new Array();
        var datarr = text.split('\n')
        for (a in datarr ) {
            datarr[a] = parseInt(datarr[a], 10); // Explicitly include base as per Álvaro's comment
        }
        return datarr;
}
function saverr(name, rr) {
	fs.appendFile(String(name) + '.txt', String(rr) + "\n", function(err) {
		if (err) throw err;
		console.log('The "data to append" was appended to file!');
	});
}

function removefile(name) {
	
	fse.remove(String(name) + '.txt', function (err) {
  if (err) return console.error(err)
 
  console.log('success!')
})
}

function epython() {
	var options = {
		mode: 'text',
		pythonPath: '/usr/bin/python',
		pythonOptions: ['-u'],
		scriptPath: 'python/',
		args: ['g1', 'g2']
	};

	PythonShell.run('hrvanalisis.py', options, function(err, results) {
		if (err) throw err;
		// results is an array consisting of messages collected during execution
		console.log('results: %j', results);
	});
}


function detach() {
	b.detachInterrupt(inputPin);
	//console.log('Interrupt detached');
}

function atach() {
	b.attachInterrupt(inputPin, true, b.RISING, interruptCallback);
	//console.log('Interrupt atached');
}
// Displaying a console message for user feedback
server.listen(console.log("Server Running ..."));