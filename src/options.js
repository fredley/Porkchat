var options = ['dark', 'fixed_width', 'friday', 'fire', 'stars', 'hamstare', 'ponies', 'upload', 'topic', 'mod'];

function save_options() {
  var new_opts = {};
  for(var i = 0; i < options.length; i++){
    new_opts[options[i]] = document.getElementById(options[i]).checked;
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
  chrome.storage.sync.get(default_opts, function(items) {
    for(var i = 0; i < options.length; i++){
      document.getElementById(options[i]).checked = items[options[i]];
    }
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
document.getElementById('info-link').href = chrome.extension.getURL('info.html');