var http = require('http');


var i = 2;
var port = 1337;
var url;

while (process.argv[i]) {
	switch (process.argv[i]) {
		case '-p':
			i++;
			if (process.argv[i] && Number(process.argv[i])) {
				port = process.argv[i];
			}
			break;
		case '-u':
			i++;
			if (process.argv[i]) {
				url = process.argv[i];
			}
			break;
	}
	i++;
}

var server = http.createServer(function (req, res) {
	if (req.method != 'GET') {
		res.writeHead(404);
		return res.end(); 
	}

	res.writeHead(200, { 'Content-Type': 'application/json' });
	res.end();
});

server.listen(port);
