var http = require('http');
var request = require('request');
var $ = require('cheerio');

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

function parseHTML(html) {
	var profile = {};

	var parsedHTML = $.load(html)
	parsedHTML('.full-name').map(function(i, link) {
		profile.fullname = link.children[0].data;
	});

	parsedHTML('#headline .title').map(function(i, link) {
		profile.title = link.children[0].data;
	})
	parsedHTML('#location .locality').map(function(i, link) {
		profile.location = link.children[0].data;
	})

	parsedHTML('.profile-picture img').map(function(i, link) {
		var src = $(link).attr('src')
		profile.picture = src;
	})

	var experience = [];
	parsedHTML('#background-experience .section-item header').map(function(i, link) {
		var item = {};
		var to, from;

		from = link.next.children[0].children[0].data
		if (link.next.children[2].name === "time") {
			to = link.next.children[2].children[0].data
		}

		var title, company;
		if (link.children.length === 2) {
			title = link.children[0].children[0].data
			company = link.children[1].children[0].children[0].data
		}
		else if (link.children.length === 3) {
			title = link.children[1].children[0].data
			company = link.children[2].children[0].children[0].data
		}
		item.title = title;
		item.company = company;
		item.fromDate = from;
		item.toDate = to;
		experience.push(item);
	})
	profile.experience = experience;

	var education = [];
	parsedHTML('#background-education .section-item header h4').map(function(i, link) {
		var item = {};
		var school = link.children[0].data || link.children[0].children[0].data
		item.school = school;
		item.degree = link.next.children[0].children[0].data;
		education.push(item);
	});
	profile.education = education;

	var skills = [];
	parsedHTML('#background-skills .endorse-item-name-text').map(function(i, link) {
		skills.push(link.children[0].data);
	})
	profile.skills = skills;

	return JSON.stringify(profile);
}

var server = http.createServer(function (req, res) {
	var body = '';
	req.setEncoding('utf8');
	req.on('data', function (chunk) {})

	req.on('end', function () {
		try {
			console.log("got connection")
			request(url, function (err, resp, html) {
				res.write(parseHTML(html));
				res.end();
			});
		} catch (er) {
			res.statusCode = 400;
			return res.end('error: ' + er.message);
		}
	})
})

server.listen(port);
