$(function() {
	var prompt = "[[b;#d33682;]user]@[[b;#6c71c4;]syui.cf] ~$ ";
	var test_help = "Press [[b;#d33682;]<Tab>]";
	var greetings = "";
	var origin_songs = [];
	var file_full = [];
	var command_all = ["help","ls","cat","nyancat","top","mpv","pacman","search"];
	var pacman_option = "-Syu";
	var ip_list = "";

	axios.get('https://syui.cf/json/keybase.json')
		.then(function (response) {
			gpg_link = JSON.stringify(response.data,null,"\t");
		})
	//.catch(function (error) {
	//    //console.log(error);
	//});
	axios.get('https://syui.cf/json/link.json', { 'Content-Type': 'application/json' })
		.then(function (response) {
			syui_link = JSON.stringify(response.data,null,"\t");
		})
	axios.get('https://syui.cf/index.json', { 'Content-Type': 'application/json' })
		.then(function (response) {
			index_json = JSON.stringify(response.data,null,"\t");
			origin_index_json = JSON.parse(index_json);
		})
	axios.get('https://syui.cf/json/file.json', { 'Content-Type': 'application/json' })
		.then(function (response) {
			file_list = JSON.stringify(response.data,null,"\t");
			music_all = response.data[0].music;
			music_l = response.data[0].music.length;
			for (var i = 0; i < music_l; i++) {
				a = i + 1;
				origin_songs.push(music_all[i][a]);
			};
			file_all = response.data[1].json;
			file_l = response.data[1].json.length;
			for (var i = 0; i < file_l; i++) {
				a = i + 1;
				file_full.push(file_all[i][a]);
			};
		})
	//$.getJSON('http://gd.geobytes.com/GetCityDetails?callback=?', function(data) {
	//    ip_list = JSON.stringify(data.geobytesipaddress, null, 2);
	//});

	function print_slowly(term, paragraph, callback) {
		var foo, i, lines;
		lines = paragraph.split("\n");
		term.pause();
		i = 0;
		foo = function(lines) {
			return setTimeout((function() {
				if (i < lines.length - 1) {
					term.echo(lines[i]);
					i++;
					return foo(lines);
				} else {
					term.resume();
					return callback();
				}
			}), 100);
		};
		return foo(lines);
	}

	function require_command(command_regex, terminal_history) {
		var executed = true;
		$.each(terminal_history, function(index, value) {
			if (command_regex.test(value)) {
				executed = true
			}
		});
		return executed;
	}

	var pacman_update_pre = "\
	\n:: Synchronizing package databases...\
	\n core is up to date\
	\n extra                               4.1 MiB  4.10M/s 00:01 [#######################] 100%\
	\n community                           3.2 MiB  3.20M/s 00:01 [#######################] 100%\
	\n archlinux is up to date\
	\n:: Starting full system upgrade...\
	\n there is nothing to do\
	";

	function interpreter(input, term) {

		var command, inputs;
		inputs = input.split(/ +/)
		command = inputs[0];

		if (inputs[0] === 'cat' && inputs[1] === '/json/link.json') {
			term.echo(syui_link);
		} else if (inputs[0] === 'cat' && inputs[1] === '/json/keybase.json') {
			term.echo(gpg_link);
		} else if (inputs[0] === 'cat' && inputs[1] === '/json/file.json') {
			term.echo(file_list);
		} else if (inputs[0] === 'help') {
			term.echo(command_all);
		} else if (inputs[0] === 'search') {
			origin_index_json.forEach(function(v,index) {
				if ( v.contents.indexOf(inputs[1]) != -1){
					s = v.title + " "  + v.href;
					term.echo(s);
				}
			});
		} else if (inputs[0] === 'mpv' && origin_songs.includes(inputs[1])) {
			music = new Audio(inputs[1]);
			music.play();
			term.insert("mpv quit");
		} else if (/mpv quit/.test(input)) {
			music.pause();
			music.currentTime = 0;
		} else if (/nyancat/.test(input)) {
			term.echo("/nyancat");
			window.location.href = '/nyancat';
		} else if (/top/.test(input)) {
			window.location.href = '/';
		} else if (inputs[0] === 'pacman' || inputs[0] === 'pacman' && inputs[1] === '-Syu') {
			print_slowly(term, pacman_update_pre, function(){
			});
		} else if (/(cd)/.test(command)) {
			bash(inputs, term);
		} else if (/ls/.test(input)) {
			term.echo(file_full);
		} else {
			term.error(command + " is not a valid command");
		}
	}

	function bash(inputs, term) {
		var argument, echo, insert;
		echo = term.echo;
		insert = term.insert;
		if (!inputs[1]) {
			//return console.log("none");
		} else {
			argument = inputs[1];
			if (/^\.\./.test(argument)) {
				return echo("-bash: cd: " + argument + ": Permission denied");
			} else {
				return echo("-bash: cd: " + argument + ": No such file or directory");
			}
		}
	}

	$('#terminal').terminal(interpreter, {
		prompt: prompt,
		name: 'test',
		greetings: greetings,
		height: 450,
		onInit: function(term) {
			term.echo(command_all);
		},
		completion: function(term, string, callback) {
			var t = $(term[0]).text();
			if (t.match(/none/)) {
				term.clear();
			} else if (t.match(/cat/)) {
				callback(file_full);
				term.clear();
			} else if (t.match(/mpv/)) {
				callback(origin_songs);
			} else if (t.match(/help/)){
				callback(command_all);
			} else {
				callback(command_all);
				term.history().clear();
			}
		},
		tabcompletion: true
	});
});
