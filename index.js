var fs = require('graceful-fs'),
  path = require('path'),
  mkdirp = require('mkdirp'),
  Mustache = require('mustache'),
  exec = require('child_process').exec;



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

updateHosts = function (servers) {

  try {
    var hostsFile = fs.readFileSync(config.hostsPath, 'utf8');
  } catch (e) {
    console.log(e);
  }

  if (hostsFile.lastIndexOf('### Server Manager') < 0) {
    hostsFile += "\n\n### Server Manager\n";
  }

  servers.forEach(function (server) {
    if (hostsFile.lastIndexOf(server.name) < 0 && server.enabled) {
      hostsFile += "\n127.0.0.1        "+server.name;
    }
  });


  try {
    fs.writeFileSync(config.hostsPath, hostsFile);
  } catch (e) {
    console.log(e);
  }
  console.log(hostsFile);
}

nginx.forEach(function (jsonObj) {
  // Remove all Enabled files.
  fs.readdirSync(config.enabledPath).forEach(function(file) {
    var filePath = config.enabledPath+'/'+file;
    fs.unlink(filePath);
  });


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
      console.log('Created config file for '+server.name);
    } catch (e) {
      console.log(e);
    }

    if (server.enabled) {
      try {
        mkdirp(config.logsFolder+'/'+server.name, function(err) { 
          if (err) {
            console.log(err);
          }
        });

        fs.symlinkSync(availablePath, enabledPath);
        console.log('Linked config file for '+server.name);
      } catch (e) {
        console.log(e);
      }
    }
    
  });
  
  if (config.updateHosts) {
    updateHosts(servers);
  }

});

if (config.doRestart) {
  exec(config.restartCommand, function (error, stdout, stderr) {
    if (error !== null) {
      console.log('exec error: ' + error);
    }
  });
}

gitHooks.forEach(function (jsonObj) {
  var gitHook = JSON.parse(jsonObj);

  gitHook.hooks.forEach(function (hook) {
    hook.actions.forEach(function (action) {
      var modelFile = fs.readFileSync('./models/gitHooks/'+hook.type+'/'+hook.version+'.mustache').toString();
      
      var output = Mustache.render(modelFile, {folder: config.logsFolder, action: action});
    });
  });

});
