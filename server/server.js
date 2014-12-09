var http = require('http');
var request = require('request');
var parse = require('./linkedin-parser');

var i = 2;
var port = 1337;
var url;
var profileCache = {};
var cacheTimeout = 60*1000; //in ms

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
		case '-c':
			i++;
			if (process.argv[i]) {
				cacheTimeout = Number(process.argv[i]);
			}
			break;
	}
	i++;
}

function updateCache(url, profile) {
	profileCache[url] = {};
	profileCache[url].profile = profile;
	profileCache[url].timeout = new Date().getTime() + cacheTimeout;
	console.log("Profile " + url + " updated");
}

function validCacheFor(url) {
	return profileCache[url] && profileCache[url].timeout > new Date().getTime();
}

function getCachedProfile(url) {
	return profileCache[url].profile;
}

var server = http.createServer(function (req, res) {
	var body = '';
	req.setEncoding('utf8');
	req.on('data', function (chunk) {})

	req.on('end', function () {
		try {
			if (validCacheFor(url)) {
				console.log("Returning cached result for " + url);
				res.write(getCachedProfile(url));
				res.end();
			} 
			else {
				request(url, function (err, resp, html) {
					parse(html, function (err, profile) {
						if (err) {
							res.statusCode = 400;
							return res.end('error: ' + err.message);
						}
						updateCache(url, profile);
						res.write(profile);
						res.end();
					});
				});
			}

		} catch (er) {
			res.statusCode = 400;
			return res.end('error: ' + er.message);
		}
	})
})

server.listen(port);
