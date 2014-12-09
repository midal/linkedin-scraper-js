var http = require('http');
var request = require('request');
var parse = require('./linkedin-parser');

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
	var body = '';
	req.setEncoding('utf8');
	req.on('data', function (chunk) {})

	req.on('end', function () {
		try {
			request(url, function (err, resp, html) {
				parse(html, function (err, profile) {
					if (err) {
						res.statusCode = 400;
						return res.end('error: ' + err.message);
					}
					res.write(profile);
					res.end();
				});
			});
		} catch (er) {
			res.statusCode = 400;
			return res.end('error: ' + er.message);
		}
	})
})

server.listen(port);
