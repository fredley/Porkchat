var options = ['dark', 'fixed_width', 'friday', 'fire', 'stars', 'hamstare', 'ponies', 'upload', 'topic', 'mod', 'hover', 'emoji', 'emoji_replace'];
var text_options = ['friday-terms',];
var text_options_defaults = ['rebecca black,'];

function save_options() {
  var new_opts = {};
  for(var i = 0; i < options.length; i++){
    new_opts[options[i]] = document.getElementById(options[i]).checked;
  }
  for(var i = 0; i < text_options.length; i++){
    new_opts[text_options[i]] = document.getElementById(text_options[i]).value;
  }
  chrome.storage.sync.set(new_opts, function() {
    var status = document.getElementById('status');
    status.className = 'shown';
    setTimeout(function() {
      status.className = '';
    }, 750);
  });
}

function restore_options() {
  var default_opts = {};
  for(var i = 0; i < options.length; i++){
    default_opts[options[i]] = true;
  }
  default_opts['fixed_width'] = false;
  for(var i = 0; i < text_options.length; i++){
    default_opts[text_options[i]] = text_options_defaults[i];
  }

  chrome.storage.sync.get(default_opts, function(items) {
    for(var i = 0; i < options.length; i++){
      document.getElementById(options[i]).checked = items[options[i]];
    }
    for(var i = 0; i < text_options.length; i++){
      document.getElementById(text_options[i]).value = items[text_options[i]];
    }
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
document.getElementById('info-link').href = chrome.extension.getURL('info.html');
