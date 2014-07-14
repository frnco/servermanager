var fs = require('graceful-fs'),
  path = require('path'),
  Mustache = require('mustache');



nginx = [];
gitHooks = [];

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
  for (var key in servers) {
    server = servers[key];
    var modelFile = fs.readFileSync('./models/nginx/'+server.type+'.mustache').toString();

    var output = Mustache.render(modelFile, server);
    console.log(output);
  }
});
