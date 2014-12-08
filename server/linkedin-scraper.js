var http = require('http');

var server = http.createServer(function (req, res) {
	if (req.method != 'GET') {
		res.writeHead(404);
		return res.end(); 
	}

	res.writeHead(200, { 'Content-Type': 'application/json' });
	res.end();
});

var port = Number(process.argv[2]) || 1337;

server.listen(port);
