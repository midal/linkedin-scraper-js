module.exports = function (html, callback) { 
	var $ = require('cheerio');

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

		return profile;
	}

	var profile = parseHTML(html);

	if (profile.fullname) {
		return callback(null, JSON.stringify(profile));
	}
	else {
		return callback(new Error('No profile data found'));
	}
}