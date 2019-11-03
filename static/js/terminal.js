$(function() {
    var pacman_install_message_post = "";
    var prompt = "[[b;#d33682;]user]@[[b;#6c71c4;]syui.cf] ~$ ";
    var days_left = Math.round((new Date('2016 01 01') - new Date()) / (1000 * 60 * 60 * 24));
    var test_url = "";
    var rsvp_url = "";
    var file_full = "/json/file.json, /json/link.json, /json/keybase.json, /gpg/pgp_keys.asc.txt"
    var test_help = "Press [[b;#d33682;]<Tab>]";
    var you_are_late = ""
    if (days_left >= 0) {
        you_are_late = ''
    }
    var greetings = you_are_late
    axios.get('https://syui.cf/json/keybase.json')
    .then(function (response) {
      gpg_link = JSON.stringify(response.data,null,"\t");
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
    axios.get('https://syui.cf/json/link.json', { 'Content-Type': 'application/json' })
    .then(function (response) {
      syui_link = JSON.stringify(response.data,null,"\t");
      console.log(syui_link);
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
    
    //axios.get('https://syui.cf/pokemon-zukan/json/pokemon.json')
    //.then(function (response) {
    //  pokemon_cp = JSON.stringify(response.data,null,"\t");
    //  console.log(response);
    //})
    //.catch(function (error) {
    //  console.log(error);
    //});
    //axios.get('https://syui.cf/mstdn.page/json/toot.json')
    //.then(function (response) {
    //  mastodon_toot = JSON.stringify(response.data,null,"\t");
    //  console.log(response);
    //})
    //.catch(function (error) {
    //  console.log(error);
    //});
    //axios.get('https://syui.cf/anime/json/feed.json')
    //.then(function (response) {
    //  anime_feed = JSON.stringify(response.data,null,"\t");
    //  console.log(response);
    //})
    //.catch(function (error) {
    //  console.log(error);
    //});

    //var pacman_list_full = '';
    axios.get('https://syui.cf/json/file.json', { 'Content-Type': 'application/json' })
    .then(function (response) {
      pacman_list_full = JSON.stringify(response.data,null,"\t");
      console.log(pacman_list_full);
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
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
    };

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
	var myAudio = new Audio();
        inputs = input.split(/ +/)
        command = inputs[0];
        if (input === "ls /json") {
            term.echo("/json/link.json");
        } else if (inputs[0] === 'ls /json/link.json' || inputs[0] === '/gpg/pgp_keys.asc.txt') {
            term.echo(pacman_list_full);
        } else if (inputs[0] === 'cat' && inputs[1] === '/json/link.json') {
            term.echo(syui_link);
        } else if (inputs[0] === 'cat' && inputs[1] === '/json/keybase.json') {
            term.echo(gpg_link);
        } else if (inputs[0] === 'cat' && inputs[1] === '/json/file.json') {
            term.echo(pacman_list_full);
        } else if (inputs[0] === 'help') {
            term.echo(test_help);
        } else if (inputs[0] === 'mastodon') {
            term.echo(mastodon_toot);
        } else if (inputs[0] === '/json/link.json') {
            term.echo(syui_link);
        } else if (inputs[0] === '/json/file.json') {
            term.echo(pacman_list_full);
        } else if (inputs[0] === '/json/keybase.json') {
            term.echo(gpg_link);
        } else if (inputs[0] === '/gpg/pgp_keys.asc.txt') {
            term.echo(gpg_link);
        } else if (inputs[0] === 'help') {
            term.echo(test_help);
        } else if (inputs[0] === 'cat') {
            term.echo(file_full);
        } else if (/(cd)/.test(command)) {
            bash(inputs, term);
        } else if (/whoami/.test(input)) {
            term.echo("user");
        } else if (/uname/.test(input)) {
            term.echo("Linux");
        } else if (command.length === 0) {} else if (/ls/.test(input)) {
            term.echo(file_full);
        } else if (/ls/.test(input)) {
            term.echo(pacman_list_full);
        } else {
            term.error(command + " is not a valid command");
        }
    }

    function bash(inputs, term) {
        var argument, echo, insert;
        echo = term.echo;
        insert = term.insert;
        if (!inputs[1]) {
            return console.log("none");
	} else {
            argument = inputs[1];
            if (/^\.\./.test(argument)) {
                return echo("-bash: cd: " + argument + ": Permission denied");
            } else {
                return echo("-bash: cd: " + argument + ": No such file or directory");
            }
        }
    };

    $('#terminal').terminal(interpreter, {
        prompt: prompt,
        name: 'test',
        greetings: greetings,
        height: 450,
        onInit: function(term) {
            term.insert("cat /json/link.json");
            term.history().clear();
        },
        completion: function(term, string, callback) {
		var t = $(term[0]).text();
		if (t.match(/cat/)) {
            		callback(["/json/link.json","/json/keybase.json","/json/file.json","/gpg/pgp_keys.asc.txt"]);
		} else if (t.match(/help/)){
            		callback(["help","ls","cat"]);
		} else {
            		callback(["help","ls","cat"]);
		}
        },
        tabcompletion: true
    });
});



