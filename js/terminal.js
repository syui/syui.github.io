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
      //console.log(response);
    })
    .catch(function (error) {
      //console.log(error);
    });
    axios.get('https://syui.cf/json/link.json', { 'Content-Type': 'application/json' })
    .then(function (response) {
      syui_link = JSON.stringify(response.data,null,"\t");
      //console.log(syui_link);
      //console.log(response);
    })
    .catch(function (error) {
      //console.log(error);
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
      //console.log(pacman_list_full);
      //console.log(response);
    })
    .catch(function (error) {
      //console.log(error);
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
     function progress(percent, width) {
        var size = Math.round(width*percent/100);
        var left = '', taken = '', i;
        for (i=size; i--;) {
            taken += '=';
        }
        if (taken.length > 0) {
            taken = taken.replace(/=$/, '>');
        }
        for (i=width-size; i--;) {
            left += ' ';
        }
        return '[' + taken + left + '] ' + percent + '%';
    }
    var animation = false;
    var timer;
    var prompt;
    var string;
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
        } else if (/nyancat/.test(input)) {
            term.echo("/nyancat");
	    window.location.href = '/nyancat';
	    //window.open('/nyancat/');
        } else if (/top/.test(input)) {
	    window.location.href = '/';
	    //window.open('/nyancat/');
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
            //return console.log("none");
	} else {
            argument = inputs[1];
            if (/^\.\./.test(argument)) {
                return echo("-bash: cd: " + argument + ": Permission denied");
            } else {
                return echo("-bash: cd: " + argument + ": No such file or directory");
            }
        }
    };

    //var url = 'https://terminal.jcubic.pl/ansi/read.php'; // CORS enabled
    //function get(url) {
    //    return fetch(url).then(res => res.text()).then(text=>text.trim());
    //};
    //var files = (await get(url + '?action=ls')).split('\n');
    //function get_ansi(name) {
    //    return fetch(url + '?raw=1&file=' + name).
    //        then(res => res.arrayBuffer()).then(a => new Uint8Array(a));
    //};
    function echo_ansi(buff) {
        var meta = AnsiLove.sauceBytes(buff);
        var cols = 80;
        var str = iconv.decode(buff, 'CP437');
        // remove code that move cursor after new line - hope this works
        str = str.replace(/\r?\n?\x1b\[A\x1b\[[0-9]+C/g, '');
        // main code - this will use unix_formatting file to format ANSI artwork
        str = $.terminal.apply_formatters(str, {});
        if (meta) {
            if (str.match(/\x1a/)) { // 26 - end of file in DOS
                str = str.replace(/\x1a.*/, '');
            }
            console.log(meta);
            cols = meta.tInfo1;
            var lines = $.terminal.split_equal(str, cols);
            // one flush to output whole image to the screen
            lines.map(line => term.echo(line, {flush: false}));
            term.flush();
        } else {
            // should we wrap to 80 cols if there is no meta SAUCE data?
            term.echo(str);
        }
        term.resume();
    };
	//var term = $('body').terminal({
        //help: function() {
        //    this.echo([
        //        'use [[;#444;]ls] to display list of files and [[;#444;]cat]',
        //        ' to display the artwork, you can also [[u;;]drag and drop] the file.',
        //        '\nOnly Code Page 437 encoding files will work (classic demo s',
        //        'cene files).\nType [[;#444;]credits] to show credits for ANSI',
        //        ' Art works. Use tab so you don\'t need to type whole filename.',
        //        '\nType [[;#444;]clear] to clear terminal.'
        //    ].join(''), {keepWords: true});
        //},
        //cat: function(name) {
        //    this.pause();
        //    get_ansi(name).then(echo_ansi);
        //},
        //ls: function() {
        //    console.log(files);
        //    this.echo(files);
        //},
        //credits: function() {
        //    this.echo('ANSI artworks taken from [[!;;;;https://fuel.wtf/packs/fuel27/]fuel magazine]')
        //}
    	//}, {
        //completion: function(string, callback) {
        //    if (this.get_command().match(/^cat /)) {
        //        callback(files);
        //    } else {
        //        callback(['ls', 'file', 'credits', 'help']);
        //    }
        //},
        //outputLimit: 250,
        //greetings: 'ANSI ART Terminal viewer\nType [[;#444;]help] for more info\n',
        //name: 'ansi'
    	//}).drop(function(array_buff) { // drop plugin
    	//    echo_ansi(new Uint8Array(array_buff));
    	//    return term.read('press enter to continue ');
    	//}, {
    	//    type: 'arraybuffer',
    	//    error: function(e) {
    	//        term.exception(e);
    	//    },
    	//    complete: function() {
    	//        term.echo('all files rendered');
    	//    }
    	//});


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
            		callback(["/json/link.json","/json/keybase.json","/json/file.json","/gpg/pgp_keys.asc.txt"]);
		} else if (t.match(/help/)){
            		callback(["help","ls","cat","nyancat","top"]);
		} else {
            		callback(["help","ls","cat","nyancat","top"]);
		}
        },
        tabcompletion: true

    });
});


