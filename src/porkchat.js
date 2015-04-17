// HamStare Shortcuts

var bindShortcutClick = function(elem){
    elem.on('click',function(e){
        if(pc_remove_hamstare){
            pc_buttons.splice(pc_buttons.indexOf($(this).html()),1);
            localStorage['pc_stares'] = JSON.stringify(pc_buttons);
            $(this).remove();
            pc_remove_hamstare = false;
            $('#hamstare_cancel').hide();
            $('#stares .button').not('.highlight').removeClass('remove');
            $('#stares').css('top',-1 * ($('#stares').height() + 35));
            e.stopPropagation();
            return;
        }
        $('#input').val($('#input').val() + $(this).html());
        $('#input').focus();
    });
};

var initHamStare = function(){
    if(!window.pc_options.hamstare) return;
    if(!('pc_stares' in localStorage)){
        window.pc_buttons = ['ಠ_ಠ'];
        localStorage['pc_stares'] = JSON.stringify(pc_buttons);
    }else{
        window.pc_buttons = JSON.parse(localStorage['pc_stares']);
    }
    var stares = $('<div id="stares"></div>');
    var button = $('<div class="button" id="hamstare">' + pc_buttons[0] + '</div>');
    for(var i=0;i<pc_buttons.length;i++){
        stares.append('<button class="button">'+ pc_buttons[i] +'</button>');
    }
    var button_row = $('<div id="hamstare_controls"></div>');
    var add_button = $('<button class="button highlight" id="hamstare_add">Add</button>');
    var remove_button = $('<button class="button highlight" id="hamstare_remove">Remove...</button>');
    var cancel_button = $('<button class="button highlight" id="hamstare_cancel">Cancel</button>');
    add_button.on('click',function(e){
        var new_text = window.prompt("Add a new quick-text:");
        if(new_text && new_text !== ""){
            window.pc_buttons.push(new_text);
            var new_button = $('<button class="button">'+ new_text +'</button>');
            button_row.before(new_button);
            bindShortcutClick(new_button);
            localStorage['pc_stares'] = JSON.stringify(pc_buttons);
            $('#stares').css('top',-1 * ($('#stares').height() + 35));
        }
        e.stopPropagation();
    });
    window.pc_remove_hamstare = false;
    window.pc_hamstare_popup = false;
    remove_button.on('click',function(e){
        if(pc_hamstare_popup || confirm('Click a shortcut to remove it')){
            pc_remove_hamstare = true;
            pc_hamstare_popup = true;
            cancel_button.show();
            $('#stares .button').not('.highlight').addClass('remove');
        }
        e.stopPropagation();
    });
    cancel_button.on('click',function(){
        pc_remove_hamstare = false;
            $(this).hide();
        $('#stares .button').not('.highlight').removeClass('remove');
    });
    button_row.append(add_button);
    button_row.append(remove_button);
    button_row.append(cancel_button);
    stares.append(button_row);
    button.append(stares);
    $('#chat-buttons').append(button);
    $('#stares').css('top',-1 * ($('#stares').height() + 35));
    button.on('click',function(){
        $('#stares').toggleClass('shown');
    });
    bindShortcutClick($('#stares .button').not('.highlight'));
    $('#stares').on('click',function(e){
        $(this).removeClass('shown');
        e.stopPropagation();
    });
}

// Expand the star list

var initStars = function() {
    if (!window.pc_options.stars) return;
    window.infoShown = localStorage.getItem('pc_info_shown') === 'true' || false;
    window.usersShown = localStorage.getItem('pc_users_shown') === 'true' || false;
    if (!infoShown) {
        $('#roomdesc, #room-tags, #sidebar-menu').hide();
    }
    if (!usersShown) {
        $('#present-users').parent().hide();
    }
    $('#starred-posts').parent().prepend('<div id="pc_star_controls"><a href="#" id="pc_toggle_info">Show Info</a> | <a href="#" id="pc_toggle_users">Show Users</a></div>');
    $('#pc_toggle_info').html((infoShown) ? 'Hide Info' : 'Show Info');
    $('#pc_toggle_users').html((usersShown) ? 'Hide Users' : 'Show Users');
    $('#pc_toggle_info').on('click', function(e) {
        e.preventDefault();
        infoShown = !infoShown;
        localStorage['pc_info_shown'] = infoShown;
        if (infoShown) {
            $('#roomdesc, #room-tags, #sidebar-menu').show();
        } else {
            $('#roomdesc, #room-tags, #sidebar-menu').hide();
        }
        $(this).html((infoShown) ? 'Hide Info' : 'Show Info');
    });
    $('#pc_toggle_users').on('click', function(e) {
        e.preventDefault();
        usersShown = !usersShown;
        localStorage['pc_users_shown'] = usersShown;
        if (usersShown) {
            $('#present-users').parent().show();
        } else {
            $('#present-users').parent().hide();
        }
        $(this).html((usersShown) ? 'Hide Users' : 'Show Users');
    });
    if ($('span.more:visible').length > 0 && $('span.more:visible').first().html().startsWith('show')) {
        $('span.more:visible')[0].click();
    }
}

// Room topic helper

var initTopic = function(){
    window.topic = $('#roomname').html() + ': ' + $('#roomdesc').html();
    $('#room-tags .tag').each(function() {
        window.topic += ' [' + $(this).html() + ']';
    });
}

var checkTopic = function(elem) {
    if (!window.pc_options.topic) return;
    if (elem.find('.content').text().indexOf('room topic changed to') === 0) {
        var newtopic = elem.find('.content').text().substring(22);
        elem.find('.content').html('<p><b>Room topic changed to:</b></p><p>' + newtopic + '</p><p><b>Previously it was:</b></p><p>' + window.topic + '</p>');
        window.topic = newtopic;
    }
}

// mod whois

var initWhois = function() {
    if (!window.pc_options.mod || window.location.href.split('//')[1].split('/')[2] !== "4") return;
    var sites = [{
        'key': 'cm',
        'name': 'Community Managers',
        'icon': 'http://cdn.sstatic.net/stackexchange/img/apple-touch-icon.png'
    }];
    var suggestions = [];
    var sugg_showing = false;
    var sugg_selected = -1;

    if (!localStorage['whois_sites']) {
        $.ajax({
            url: 'https://api.stackexchange.com/2.2/sites?pagesize=999',
            format: 'json',
            success: function(data) {
                data['items'].map(function(site) {
                    if (site['api_site_parameter'].substr(0, 4) !== 'meta') {
                        sites.push({
                            'key': site['api_site_parameter'],
                            'name': site['name'],
                            'icon': site['icon_url']
                        });
                    }
                });
                console.log(sites.length + ' sites loaded');
                localStorage['whois_sites'] = JSON.stringify(sites);
            }
        });
    } else {
        sites = sites.concat(JSON.parse(localStorage['whois_sites']));
        console.log(sites.length + ' sites loaded from local storage');
    }

    $("#tabcomplete").after('<div id="whoiscomplete"></div>');

    var mod = function(m, n) {
        return ((m % n) + n) % n;
    };

    var render = function() {
        $('#whoiscomplete').html('');
        suggestions.map(function(s) {
            $('#whoiscomplete').append('<li ' + (s.selected ? 'class="chosen"' : '') + '><img width="18" height="18" src="' + s.icon + '"><span class="mention-name">' + s.name + '</span></li>');
            if (s.selected) {
                var val = 'whois ' + s.key;
                if (s.key != 'cm') val += ' mods';
                $('#input').val(val);
            }
        });
    };
    $('#input').on('keydown', function(e) {
        if (sugg_showing && e.keyCode === 9) {
            e.preventDefault();
            suggestions[mod(sugg_selected, suggestions.length)]['selected'] = false;
            sugg_selected += (e.shiftKey) ? -1 : 1;
            suggestions[mod(sugg_selected, suggestions.length)]['selected'] = true;
            render();
            return;
        } else if (e.shiftKey) {
            return;
        }
        sugg_selected = -1;
        var txt = $(this).val() + String.fromCharCode(e.keyCode);
        txt = txt.toLowerCase();
        if (e.keyCode === 8) txt = txt.substr(0, txt.length - 2);
        if (txt.substr(0, 6) === 'whois ' && txt.length > 6) {
            var lookup = txt.substr(6);
            suggestions = [];
            sites.map(function(s) {
                if (s.key.indexOf(lookup) === 0) {
                    s['selected'] = false;
                    suggestions.push(s);
                }
            });
            if (suggestions.length > 0) {
                sugg_showing = true;
                render();
            } else {
                sugg_showing = false;
                $('#whoiscomplete').html('');
            }
        } else if (sugg_showing) {
            sugg_showing = false;
            $('#whoiscomplete').html('');
        }
    });
}


// Burn script
function fire(o, source) {
    var r = Math.random();
    o.css(source,
        Math.floor(1 + r * 1) + 'px -' + Math.floor(1 + r * 1) + 'px ' + Math.floor(1 + r * 1) + 'px #A10606,' +
        Math.floor(1 + r * 1) + 'px -10px ' + Math.floor(10 + r * 15) + 'px white,' +
        '0 -' + Math.floor(1 + r * 2) + 'px ' + Math.floor(3 + r * 6) + 'px red,' +
        Math.floor(1 + r * 2) + 'px -' + Math.floor(1 + r * 2) + 'px ' + Math.floor(5 + r * 15) + 'px white,     ' +
        '5px -' + Math.floor(5 + r * 10) + 'px 15px lightyellow,' +
        '8px -' + Math.floor(1 + r * 2) + 'px ' + Math.floor(10 + r * 20) + 'px yellow,' +
        '12px -3px ' + Math.floor(1 + r * 2) + 'px orange,' +
        '5px -6px ' + Math.floor(2 + r * 4) + 'px orange,' +
        '15px -' + Math.floor(2 + r * 4) + 'px 30px darkorange,' +
        '0px -' + Math.floor(2 + r * 4) + 'px ' + Math.floor(2 + r * 4) + 'px red,' +
        Math.floor(2 + r * 4) + 'px -' + Math.floor(2 + r * 4) + 'px 20px red,' +
        '-' + 1 + Math.floor(r * 2) + 'px -1px ' + Math.floor(4 + r * 4) + 'px red,' +
        1 + Math.floor(r * 2) + 'px -3px ' + Math.floor(4 + r * 4) + 'px red,' +
        Math.floor(2 + r * 4) + 'px -2px ' + Math.floor(4 + r * 4) + 'px red,' +
        1 + Math.floor(r * 2) + 'px -' + Math.floor(r * 4) + 'px ' + Math.floor(7 + r * 2) + 'px red,' +
        1 + Math.floor(r * 2) + 'px -15px ' + 5 + Math.floor(r * 11) + 'px rgba(0,0,0,0.3),' +
        2 + Math.floor(r * 4) + 'px -16px ' + 5 + Math.floor(r * 12) + 'px rgba(0,0,0,0.3),' +
        5 + Math.floor(r * 6) + 'px -20px ' + 5 + Math.floor(r * 13) + 'px rgba(0,0,0,0.3),' +
        5 + Math.floor(r * 4) + 'px -15px ' + 5 + Math.floor(r * 14) + 'px rgba(0,0,0,0.3),' +
        5 + Math.floor(r * 5) + 'px -' + 5 + Math.floor(r * 10) + 'px ' + 5 + Math.floor(r * 10) + 'px rgba(0,0,0,0.3),' +
        5 + Math.floor(r * 8) + 'px -9px ' + 5 + Math.floor(r * 10) + 'px rgba(0,0,0,0.3)');
}

function extinguish(o) {
    o.css('text-shadow', 'none');
}

var fireplace;
var grate;

var burn = function(elem) {
    elem.addClass('burnt');
    elem.fadeOut(5000, function() {
        extinguish(elem);
        //check if all messages have been burnt
        var consumed = true;
        elem.parent().find('.message').each(function() {
            if (!$(this).hasClass('burnt')) {
                consumed = false;
            }
        });
        if (consumed) {
            elem.parent().parent().hide();
        }
        clearInterval(fireplace);
        clearInterval(grate);
    });
    fireplace = setInterval(function() {
        fire(elem, 'text-shadow');
    }, 60);
    if (elem.find('.user-image').length > 0) {
        grate = setInterval(function() {
            fire(elem.find('img'), 'box-shadow');
        }, 60);
    }
}

function kindle(elem) {
    if (!window.pc_options.fire) return;
    //TODO internal image
    var meta = $('<span class="burn vote-count-container"><span class="img vote" title="Set fire to this message"><img src="http://tommedley.com/files/flame.png" title="BURN" alt="BURN" /></span><span class="times"></span></span>&nbsp;');
    elem.find('.meta').prepend(meta);
    meta.on('click', function(e) {
        e.preventDefault();
        burn(elem);
    });
}

// Created by STRd6
// MIT License
// Used for drag + drop uploading
var jquery_paste = function($) {
    var defaults;
    $.event.fix = (function(originalFix) {
        return function(event) {
            event = originalFix.apply(this, arguments);
            if (event.type.indexOf('copy') === 0 || event.type.indexOf('paste') === 0) {
                event.clipboardData = event.originalEvent.clipboardData;
            }
            return event;
        };
    })($.event.fix);
    defaults = {
        callback: $.noop,
        matchType: /image.*/
    };
    return $.fn.pasteImageReader = function(options) {
        if (typeof options === "function") {
            options = {
                callback: options
            };
        }
        options = $.extend({}, defaults, options);
        return this.each(function() {
            var $this, element;
            element = this;
            $this = $(this);
            return $this.bind('paste', function(event) {
                var clipboardData, found;
                found = false;
                clipboardData = event.clipboardData;
                return Array.prototype.forEach.call(clipboardData.types, function(type, i) {
                    var file, reader;
                    if (found) {
                        return;
                    }
                    if (type.match(options.matchType) || clipboardData.items[i].type.match(options.matchType)) {
                        file = clipboardData.items[i].getAsFile();
                        reader = new FileReader();
                        reader.onload = function(evt) {
                            return options.callback.call(element, {
                                dataURL: evt.target.result,
                                event: evt,
                                file: file,
                                name: file.name
                            });
                        };
                        reader.readAsDataURL(file);
                        return found = true;
                    }
                });
            });
        });
    };
};

var upload = function(files) {
    initFileUpload().showDialog(function(a) {
        if (a == null) return;
        $('#input').val($('#input').val() + a);
        $('#input').focus();
    });
    setTimeout(function() {
        $('#filename-input').prop("files", files);
        setTimeout(function() {
            // $('input[value="upload"]').click();
        }, 20);
    }, 20);
}

var initUpload = function() {
    var fileDrag = true;
    $('body').append('<div id="dropper"><h1>Upload image!</h1></div>');
    $('body').on({
        dragstart: function(e){
            console.log('dragstart');
            fileDrag = false; // drags from outside the browser window don't call this
        },
        dragenter: function(e) {
            if(fileDrag){
                console.log('dragenter');
                $('#dropper').show();
                e.preventDefault();
                e.stopPropagation();
            }
        },
        dragover: function(e) {
            if(fileDrag){
                console.log('dragover');
                $('#dropper').show();
                e.preventDefault();
                e.stopPropagation();
            }
        },
        dragend: function(e) {
            console.log('dragend');
            fileDrag = true;
            $('#dropper').hide();
            e.preventDefault();
            e.stopPropagation();
        },
        drop: function(e) {
            $('#dropper').hide();
            fileDrag = true;
            if (e.originalEvent.dataTransfer && e.originalEvent.dataTransfer.files.length) {
                e.preventDefault();
                e.stopPropagation();
                var files = e.originalEvent.dataTransfer.files;
                upload(files);
            }
        }
    });
    $('#dropper').on('click', function(e) {
        fileDrag = true;
        $(this).hide();
    });
}

// Use yahoo to bypass CORS :-)
// Used for Friday link checking
$.yjax = (function(_ajax) {
    var protocol = location.protocol,
        hostname = location.hostname,
        exRegex = RegExp(protocol + '//' + hostname),
        YQL = 'http' + (/^https/.test(protocol) ? 's' : '') + '://query.yahooapis.com/v1/public/yql?callback=?',
        query = "use 'http://www.datatables.org/javascript/execute.xml' as j; select * from j  where code='response.object = y.rest(\"{URL}\").followRedirects(true).get();'",
        query2 = "use 'http://www.datatables.org/javascript/execute.xml' as j; select * from j  where code='response.object = y.rest(\"{URL}\").followRedirects(false).get();'";

    function isExternal(url) {
        return !exRegex.test(url) && /:\/\//.test(url);
    }
    return function(o) {
        var url = o.url;
        if (/get/i.test(o.type) && !/json/i.test(o.dataType) && isExternal(url)) {
            // Manipulate options so that JSONP-x request is made to YQL
            o.url = YQL;
            o.dataType = 'json';
            var qstr = (o.redirect) ? query : query2;
            o.data = {
                q: qstr.replace(
                    '{URL}',
                    url + (o.data ?
                        (/\?/.test(url) ? '&' : '?') + jQuery.param(o.data) : '')
                ),
                format: 'xml'
            };
            // Since it's a JSONP request
            // complete === success
            if (!o.success && o.complete) {
                o.success = o.complete;
                delete o.complete;
            }

            o.success = (function(_success) {
                return function(data) {

                    if (_success) {
                        // Fake XHR callback.
                        _success.call(this, {
                            res: data,
                            responseText: (data.results[0] || '')
                                // YQL screws with <script>s
                                // Get rid of them
                                .replace(/<script[^>]+?\/>|<script(.|\s)*?\/script>/gi, '')
                        }, 'success');
                    }

                };
            })(o.success);

        }
        return _ajax.apply(this, arguments);

    };
})($.ajax);

// Check a link for potential Rebecca Black videos.
function checkFriday(elem) {
    if (!window.pc_options.friday) return;
    $.yjax({
        url: elem.attr('href'),
        type: 'GET',
        redirect: true,
        success: function(page) {
            if (page.responseText.indexOf('Rebecca Black') > -1) {
                elem.css('color', '#f00 !important');
                elem.html('CAUTION: REBECCA BLACK LINK (' + elem.html() + ')');
            } else {
                console.log('trying ' + elem.attr('href') + ' again');
                $.yjax({
                    url: elem.attr('href'),
                    type: 'GET',
                    success: function(page) {
                        if (page.responseText.indexOf('Rebecca Black') > -1) {
                            elem.css('color', '#f00 !important');
                            elem.html('CAUTION: REBECCA BLACK LINK (' + elem.html() + ')');
                        }
                    },
                    error: function() {
                        console.log('fail');
                    }
                });
            }
        },
        error: function() {
            console.log('fail');
        }
    });
}

// Logo

var showLogo = function(){
    var img_src = (pc_options.dark) ? pc_res.logo_white : pc_res.logo;
    var link = $('<a id="pc_logo" href="#" title="Porkchat is loaded"><img src="' + img_src + '" alt="Porkchat"></a>');
    $('#footer-logo').prepend(link);
    var about = $('<div id="pc_about_shade"><div id="pc_about"><img src="'+ pc_res.logo +'" alt="Porkchat"><p>Porkchat is a collection of scripts made by <a href="http://gaming.stackexchange.com/users/3610/fredley">fredley</a>.</p><p>To view scripts, and enable/disable them, go to the extensions page (chrome://extensions) and click Options by this extension.</p></div></div>');
    $('body').append(about);
    link.on('click',function(e){
        about.fadeIn('fast');
        e.preventDefault();
    });
    about.on('click',function(){
        about.fadeOut('fast');
    });
}

function checkStarred() {
    $('li').each(function() {
        if (!$(this).hasClass('checked')) {
            $(this).addClass('checked');
            if ($(this).find('a').length > 0) {
                $(this).find('a').each(function() {
                    checkFriday($(this));
                });
            }
        }
    });
}

function checkMessages() {
    $('.message').each(function() {
        if (!$(this).hasClass('checked')) {
            $(this).addClass('checked');
            kindle($(this));
            checkTopic($(this));
            if ($(this).find('.content').first().find('a').length > 0) {
                $(this).find('.content').first().find('a').each(function() {
                    checkFriday($(this));
                });
            }
        }
    });
}

$(document).ready(function() {
    var wait = setInterval(function() {
        if ($('.message').length > 0) {
            clearInterval(wait);
            showLogo();
            checkMessages();
            initWhois();
            initStars();
            initHamStare();
            initTopic();
            $('#chat .message').livequery(checkMessages);
            $('#starred-posts li').livequery(checkStarred);
            if (window.pc_options.upload) initUpload();
        }
    }, 500);
});
