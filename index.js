var fs = require('graceful-fs'),
  path = require('path'),
  Mustache = require('mustache');



nginx = [];
gitHooks = [];

var config = require('./config/server');

fs.readdirSync("./config/nginx/").forEach(function(file) {
  if (file != 'example.json') {
    nginx.push(fs.readFileSync("./config/nginx/" + file));
  }
});

fs.readdirSync("./config/gitHooks/").forEach(function(file) {
  if (file != 'example.json') {
    gitHooks.push(fs.readFileSync("./config/gitHooks/" + file));
  }
});

nginx.forEach(function (jsonObj) {
  var servers = JSON.parse(jsonObj);
  servers.forEach(function (server) {
    var modelFile = fs.readFileSync('./models/nginx/'+server.type+'.mustache').toString();

    var output = Mustache.render(modelFile, {logsFolder: config.logsFolder, server: server});


    var availablePath = config.availablePath+"/"+server.name+".conf";
    var enabledPath = config.enabledPath+"/"+server.name+".conf";

    try {
      fs.unlinkSync(enabledPath);
    } catch (e) {
      
    }

    try {
      fs.writeFileSync(availablePath, output);
    } catch (e) {
      console.log(e);
    }

    if (server.enabled) {
      try {
        fs.symlinkSync(availablePath, enabledPath);
      } catch (e) {
        console.log(e);
      }
    }



  });
});

gitHooks.forEach(function (jsonObj) {
  var gitHook = JSON.parse(jsonObj);

  gitHook.hooks.forEach(function (hook) {
    hook.actions.forEach(function (action) {
      var modelFile = fs.readFileSync('./models/gitHooks/'+hook.type+'/'+hook.version+'.mustache').toString();
      
      var output = Mustache.render(modelFile, {folder: config.logsFolder, action: action});
    });
  });

});
