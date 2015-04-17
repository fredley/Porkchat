var options = ['dark', 'fixed_width', 'friday', 'fire', 'stars', 'hamstare', 'ponies', 'upload', 'topic', 'mod'];
var res = {
    'logo': chrome.extension.getURL('icon_128.png'),
    'logo_white': chrome.extension.getURL('icon_white.png'),
    'ver': '1'
};
var enabled = {};
for(var i=0; i<options.length; i++){
    enabled[options[i]] = true;
}
function injectCSS(filename){
    var c = document.createElement('link');
    c.rel = "stylesheet";
    c.href = chrome.extension.getURL(filename);
    document.body.appendChild(c);
}
function injectJS(filename){
    var s = document.createElement('script');
    s.src = chrome.extension.getURL(filename);
    document.body.appendChild(s);
}
chrome.storage.sync.get(enabled, function(options) {

    injectCSS('global.css');

    var o = document.createElement('script');
    o.type = 'text/javascript';
    o.textContent = "window.pc_options=" + JSON.stringify(options) + ';window.pc_res=' + JSON.stringify(res) + ';';
    document.body.appendChild(o);

    injectJS('porkchat.js');

    if(options.ponies){
        injectCSS('ponies.css');
    }
    if(options.dark){
        injectCSS('dark.css');
    }
    if(options.fixed_width){
        injectCSS('fixed-width.css');
    }
});
