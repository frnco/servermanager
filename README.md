ServerManager
=============

NOT WORKING AS OF YET.

This is a project I'm making to manage my own VPSs. Anyone willing to help will be welcome.

The idea is to package it on the future and make it easier to create new Models and Config files to import, so that people can simply add ServerManager as a dependency. It's also ideal because I myself want it to run through a `git-hook` whenever I push changes on the config files to the server.


Now to the point:
---------------------

ServerManager is a Node Application to maintain Nginx Configuration Files and Git Hooks.

It will use .mustache templates to create the right files for your gitHooks and Server Configurations

How it's gonna work:


### For Server (NGinx) management:

You edit `config/server.json` for the correct NGinx Paths.  
(In the future there will also be an option for Apache.)


You creat a JSON file under `config/nginx`, i.e. a file called `webSite,json`:

    {
      "webSite": {
        "type": "php",
        "port": "80",
        "name": "www.example.com",
        "root": "/var/www/example/site_folder",
        "locations": {
          "root": {
            "path": "/"
          }
        },
        "rewriteLocations": {
          "Downloads": {
            "path": "/examplePath",
            "destination": "/correctPath"
          }
        },
        "redirectLocations": {
          "Downloads" : {
            "path": "/downloads",
            "uri": "downloads.example.com"
          }
        }
      }
    }


`rewriteLocations` work so as to rewrite many things, i.e. `www.example.com/Downloads` to `www.example.com/downloads`. You omit the URL (`www.example.com`) when writing the JSON.

The ServerManager will parse this file, choose the appropriate model (Using the `type` attribute) and create this file in the path for your


### For GitHooks:

You creat a JSON file under `config/gitHooks`, i.e. a file called `webSite,json`:

    {
      "exampleHook" : {
        "type": "php",
        "gitPath": "/var/repositories/example",
        "file": "post-update",
        "actions": {
          "updateMaster": {
            "path": "/var/www/example/site_folder",
            "branch": "master"
          },
          "updateTesting": {
            "path": "/var/www/example/site_folder",
            "branch": "testing"
          }
        }
      }
    }

The ServerManager will parse this file, choose the appropriate model (Using the `type` attribute), go to the gitPath and, under the `hooks` folder, create the appropriate `file` and populate it repeating the contents of the `model` for each action.