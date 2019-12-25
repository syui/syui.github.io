$(function() {
    var pacman_install_message_post = "";
    var prompt = "[[b;#d33682;]user]@[[b;#6c71c4;]syui.cf] ~$ ";
    var days_left = Math.round((new Date('2016 01 01') - new Date()) / (1000 * 60 * 60 * 24));
    var test_help = "Press [[b;#d33682;]<Tab>]";
    var greetings = ""
    var origin_songs = [];
    var file_full = [];

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
    HTMLAudioElement.prototype.stop = function()
    {
	this.pause();
	this.currentTime = 0.0;
    }

    function interpreter(input, term) {

	var command, inputs;
	inputs = input.split(/ +/)
	command = inputs[0];

	if (input === "ls /json") {
	    term.echo("/json/link.json");
	} else if (inputs[0] === 'cat' && inputs[1] === '/json/link.json') {
	    term.echo(syui_link);
	} else if (inputs[0] === 'cat' && inputs[1] === '/json/keybase.json') {
	    term.echo(gpg_link);
	} else if (inputs[0] === 'cat' && inputs[1] === '/json/file.json') {
	    term.echo(file_list);
	} else if (inputs[0] === 'help') {
	    term.echo(test_help);
	} else if (inputs[0] === 'cat') {
	    term.echo(file_full);
	} else if (/(cd)/.test(command)) {
	    bash(inputs, term);
	} else if (/whoami/.test(input)) {
	    term.echo("user");
	} else if (/nyancat/.test(input)) {
	    term.echo("/nyancat");
	    window.location.href = '/nyancat';
	} else if (/top/.test(input)) {
	    window.location.href = '/';
	} else if (/uname/.test(input)) {
	    term.echo("Linux");
	} else if (command.length === 0) {} else if (/ls/.test(input)) {
	    term.echo(file_full);
	} else if (/ls/.test(input)) {
	    term.echo(file_list);
	} else if (inputs[0] === 'mpv' && origin_songs.includes(inputs[1])) {
	    music = new Audio(inputs[1]);
	    music.play();
	    term.insert("mpv quit");
	} else if (/mpv quit/.test(input)) {
	    music.pause();
	    music.currentTime = 0;
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
	    //term.insert("cat /json/link.json");
	    term.history().clear();
	},
	completion: function(term, string, callback) {

	    var t = $(term[0]).text();
	    if (t.match(/cat/)) {
		callback(file_full);
	    } else if (t.match(/mpv/)) {
		callback(origin_songs);
	    } else if (t.match(/help/)){
		callback(["help","ls","cat","nyancat","top"]);
	    } else {
		callback(["help","ls","cat","nyancat","top"]);
	    }
	},
	tabcompletion: true
    });
});
