/*! jquery.livequery - v1.3.6 - 2016-12-09
 * Copyright (c)
 *  (c) 2010, Brandon Aaron (http://brandonaaron.net)
 *  (c) 2012 - 2016, Alexander Zaytsev (https://alexzaytsev.me)
 * Dual licensed under the MIT (MIT_LICENSE.txt)
 * and GPL Version 2 (GPL_LICENSE.txt) licenses.
 */
!function(a){"function"==typeof define&&define.amd?define(["jquery"],a):a("object"==typeof exports?require("jquery"):jQuery)}(function(a,b){function c(a,b,c,d){return!(a.selector!=b.selector||a.context!=b.context||c&&c.$lqguid!=b.fn.$lqguid||d&&d.$lqguid!=b.fn2.$lqguid)}a.extend(a.fn,{livequery:function(b,e){var f,g=this;return a.each(d.queries,function(a,d){if(c(g,d,b,e))return(f=d)&&!1}),f=f||new d(g.selector,g.context,b,e),f.stopped=!1,f.run(),g},expire:function(b,e){var f=this;return a.each(d.queries,function(a,g){c(f,g,b,e)&&!f.stopped&&d.stop(g.id)}),f}});var d=a.livequery=function(b,c,e,f){var g=this;return g.selector=b,g.context=c,g.fn=e,g.fn2=f,g.elements=a([]),g.stopped=!1,g.id=d.queries.push(g)-1,e.$lqguid=e.$lqguid||d.guid++,f&&(f.$lqguid=f.$lqguid||d.guid++),g};d.prototype={stop:function(){var b=this;b.stopped||(b.fn2&&b.elements.each(b.fn2),b.elements=a([]),b.stopped=!0)},run:function(){var b=this;if(!b.stopped){var c=b.elements,d=a(b.selector,b.context),e=d.not(c),f=c.not(d);b.elements=d,e.each(b.fn),b.fn2&&f.each(b.fn2)}}},a.extend(d,{guid:0,queries:[],queue:[],running:!1,timeout:null,registered:[],checkQueue:function(){if(d.running&&d.queue.length)for(var a=d.queue.length;a--;)d.queries[d.queue.shift()].run()},pause:function(){d.running=!1},play:function(){d.running=!0,d.run()},registerPlugin:function(){a.each(arguments,function(b,c){if(a.fn[c]&&!(a.inArray(c,d.registered)>0)){var e=a.fn[c];a.fn[c]=function(){var a=e.apply(this,arguments);return d.run(),a},d.registered.push(c)}})},run:function(c){c!==b?a.inArray(c,d.queue)<0&&d.queue.push(c):a.each(d.queries,function(b){a.inArray(b,d.queue)<0&&d.queue.push(b)}),d.timeout&&clearTimeout(d.timeout),d.timeout=setTimeout(d.checkQueue,20)},stop:function(c){c!==b?d.queries[c].stop():a.each(d.queries,d.prototype.stop)}}),d.registerPlugin("append","prepend","after","before","wrap","attr","removeAttr","addClass","removeClass","toggleClass","empty","remove","html","prop","removeProp"),a(function(){d.play()})});

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
    if (!window.pc_options.hamstare){ return };
    if (!('pc_stares' in localStorage)){
        window.pc_buttons = ['ಠ_ಠ'];
        localStorage['pc_stares'] = JSON.stringify(pc_buttons);
    } else {
        window.pc_buttons = JSON.parse(localStorage['pc_stares']);
    }
    var stares = $('<div id="stares"></div>');
    var button = $('<div class="button" id="hamstare">' + pc_buttons[0] + '</div>');
    for(var i = 0; i < pc_buttons.length;i++){
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

// mod edit button for message history

var initEditButton = function() {
    var url_bits = location.href.split('/');
    if(!window.pc_options.mod || url_bits[3] !== 'messages') return;
    var button = $('<a href="'+location.href+'" class="button">Edit message</a>');
    var postid = url_bits[4];
    button.on('click',function(){
        var text = prompt("New message text","(deleted)");
        var data = {
            text: text,
            fkey: localStorage['pc_fkey']
        };
        $.post('//'+url_bits[2]+'/messages/'+postid, data);
    });
    $('#content form').after(button);
}

// mod add user to room

var checkPopup = function() {
    if ($('.user-popup div a').length < 1){
        setTimeout(function(){checkPopup();},100);
    }
    var link = $('<div><a href="#">give explicit write access</a></div>');
    link.on('click',function(){
        var userid = $('.user-popup a').first().attr('href').split('/')[2];
        var data = {
            fkey: fkey().fkey,
            aclUserId: userid,
            userAccess: "read-write"
        }
        $.post("//"+location.href.split('/')[2]+"/rooms/setuseraccess/" + CHAT.CURRENT_ROOM_ID, data);
        $('.user-popup .btn-close').click();
        return false;
    });
    $('.user-popup div a:contains("room-owner")').parent().after(link);
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
                localStorage['whois_sites'] = JSON.stringify(sites);
            }
        });
    } else {
        sites = sites.concat(JSON.parse(localStorage['whois_sites']));
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
        var txt = $(this).val() + String.fromCharCode(e.keyCode).toLowerCase();
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
    if (!window.pc_options.fire){ return };
    if(elem.find('.burn.vote-count-container').length > 0){ return };
    var meta = $('<span class="burn vote-count-container"><span class="img vote" title="Set fire to this message"><img src="' + pc_res.flame + '" title="BURN" alt="BURN" /></span><span class="times"></span></span>&nbsp;');
    elem.find('.meta').prepend(meta);
    meta.on('click', function(e) {
        e.preventDefault();
        burn($(this).parent().parent());
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
                    if (found) { return; }
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
            fileDrag = false; // drags from outside the browser window don't call this
        },
        dragenter: function(e) {
            if (fileDrag){
                $('#dropper').show();
                e.preventDefault();
                e.stopPropagation();
            }
        },
        dragover: function(e) {
            if (fileDrag){
                $('#dropper').show();
                e.preventDefault();
                e.stopPropagation();
            }
        },
        dragend: function(e) {
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
function checkFriday(elem, checkAgain) {
    if (!window.pc_options.friday) { return; }
    if (elem.hasClass('permalink')){ return; }
    $.yjax({
        url: elem.attr('href'),
        type: 'GET',
        redirect: true,
        success: function(page) {
            page = page.hasOwnProperty('responseText') ? page.responseText : page;
            for(var i = 0; i < window.friday_terms.length; i++) {
                var term = $.trim(window.friday_terms[i]);
                if (term == ""){ continue; }
                if (page && page.toLowerCase().indexOf(term) > -1) {
                    elem.css('color', '#f00 !important');
                    elem.html('CAUTION: '+term.toUpperCase()+' LINK (' + elem.html() + ')');
                } else {
                    if (checkAgain){
                        checkFriday(elem, false);
                    }
                }
            }
        }
    });
}

function addImageHover(el){
    if (!window.pc_options.hover){ return };
    const href = el.attr('href');
    let force_img = el.parent().clone().children().remove().end().text().trim()[0] === '!';
    if(force_img || ['jpeg', 'jpg', 'gif', 'png'].map(function(ext){
        return href.endsWith(ext);
    }).reduce(function(a,b){ return a || b})){
        el.hover(function(){
            $('body').append($('<div>').addClass('img-hover').append($('<img>').attr('src', href)));
        }, function(){
            $('.img-hover').remove();
        })
    }
}

// Logo

var showLogo = function(){
    var img_src = (pc_options.dark ? pc_res.logo_white : pc_res.logo);
    var link = $('<a id="pc_logo" href="#" title="Porkchat is loaded"><img src="' + img_src + '" alt="Porkchat"></a>');
    $('#footer-logo').prepend(link);
    var about = $('<div id="pc_about_shade"><div id="pc_about"><img src="'+ pc_res.logo +'" alt="Porkchat"><p>Porkchat is a collection of scripts made by <a href="http://gaming.stackexchange.com/users/3610/fredley">fredley</a>.</p><p>To view scripts, and enable/disable them, go to the extensions page (chrome://extensions) and click Options by this extension.</p><p class="about-muted">Version: ' + window.pc_version + '</p></div></div>');
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
                    checkFriday($(this), true);
                    addImageHover($(this));
                });
            }
        }
    });
}

function checkEmoji(el){
    if (!window.pc_options.emoji){ return };
    let text = el.find('.content').text().trim();
    let is_reply = false;
    if(el.find('.reply-info').length > 0){
        text = text.split(' ').slice(1).join(' ');
        is_reply = true;
    }
    if(text.length > 0 && isOnlyEmoji(text)){
        if(is_reply){
            el.find('.content').text(text);
        }
        el.addClass('emoji');
    }
}

function checkMessages() {
    $('.message').each(function() {
        if (!$(this).hasClass('checked')) {
            $(this).addClass('checked');
            kindle($(this));
            checkTopic($(this));
            checkEmoji($(this));
            checkTwitter($(this));
            if ($(this).find('.content').first().find('a').length > 0) {
                $(this).find('.content').first().find('a').each(function() {
                    checkFriday($(this), true);
                });
            }
        }
    });
}

function checkTwitter(el){
    if (!window.pc_options.twitter){ console.log("no"); return };
    if(el.find('.ob-tweet').length > 0){
        el.parent().find('.timestamp').css({
            position: 'absolute',
            right: '10px'
        })
        el.find('a').each(function(){
            const href = $(this).attr('href')
            if(href.startsWith('https://t.co/')){
                const link = $(this);
                $.yjax({
                    url: href,
                    type: 'GET',
                    redirect: true,
                    success: function(page){
                        $.yjax({
                            url: page.responseText.split('location.replace("')[1].split('")&lt;')[0].replace(/\\\//g, '/'),
                            type: 'GET',
                            redirect: false,
                            success: function(actual_page){
                                const image_urls = actual_page.responseText
                                    .split('data-image-url="')
                                    .slice(1, 4)
                                    .map((s) => {
                                        return s.split('"')[0]
                                    })
                                if(image_urls.length > 1){
                                    const div = $('<div>')
                                        .addClass('twitter-gall')
                                        .addClass('twitter-gall-' + image_urls.length)
                                    image_urls.map((image_url) => {
                                        div.append(
                                            $('<img>')
                                            .attr('src', image_url)
                                            .addClass('user-image')
                                        )
                                    })
                                    link.html(div)
                                }else{
                                    link.html(
                                        $('<img>')
                                        .attr('src', image_urls[0])
                                        .addClass('user-image')
                                    );
                                }
                            }
                        })
                    }
                })
            }
        })
    }
}

function isOnlyEmoji(str) {
    str = str.trim()
    // https://stackoverflow.com/a/39652525/319618
    var r = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c[\ude32-\ude3a]|[\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g
    return str.trim().replace(r, '').length === 0
}

function rainbow() {
    $('*:visible').addClass('rainbow');
    $('img:visible').addClass('spin');
    // no going back
}

$(document).ready(function() {
    let k_code = '';
    const target = '38384040373937396665';
    $('body').on('keydown', (e) => {
        // literally log every keystroke
        k_code += String(e.which);
        if (target === k_code){
            rainbow();
        } else if (!target.startsWith(k_code)){
            k_code = String(e.which)
        }
    })
    var wait = setInterval(function() {
        if ($('.message').length > 0) {
            window.friday_terms = window.pc_options['friday-terms'].split(',');
            clearInterval(wait);
            showLogo();
            checkMessages();
            initWhois();
            initStars();
            initHamStare();
            initTopic();
            $('#chat .message').livequery(checkMessages);
            $('#starred-posts li').livequery(checkStarred);
            if (window.pc_options.mod) $('.user-popup').livequery(checkPopup);
            if (window.pc_options.upload) initUpload();
        }
    }, 500);
    if (window.pc_options.mod) initEditButton();
});
