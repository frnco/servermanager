var fs = require('graceful-fs'),
  path = require('path'),
  mustache = require('mustache');



nginx = [];
gitHooks = [];

fs.readdirSync("./config/nginx/").forEach(function(file) {
  nginx.push(fs.readFileSync("./config/nginx/" + file));
});

fs.readdirSync("./config/gitHooks/").forEach(function(file) {
  gitHooks.push(fs.readFileSync("./config/gitHooks/" + file));
});

nginx.forEach(function (jsonObj) {
  var servers = JSON.parse(jsonObj);
  for (var key in servers) {
    server = servers[key];
    console.log(server);
  }
});
