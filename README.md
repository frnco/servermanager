ServerManager
=============

### What Works

* Nginx -> Setting up and deploying configuratioin files using JSon.

### What doesn't Work

* GitHooks -> Setting up and deploying Git Hooks.


This is a project I'm making to manage my own VPSs. Anyone willing to help will be welcome.

The idea is to package it on the future and make it easier to create new Models and Config files to import, so that people can simply add ServerManager as a dependency. It's also ideal because I myself want it to run through a `git-hook` whenever I push changes on the config files to the server.


Now to the point:
---------------------

ServerManager is a Node Application to maintain Nginx Configuration Files and Git Hooks.

It will use .mustache templates to create the right files for your gitHooks and Server Configurations

How it's gonna work:

### Configuring the Server:

You edit `config/server.json` for the correct NGinx Paths.  
(In the future there will also be an option for Apache.)

    {
      "serverType": "nginx",
      "availablePath": "/etc/nginx/sites-available",
      "enabledPath": "/etc/nginx/sites-enabled",
      "logsFolder": "/var/logs/nginx",
      "restartCommand": "sudo service nginx restart"
    }


Pretty straightforward. As you can imagine, the file will be created on the `availablePath` and, if enabled, Symlinked to the `enabledPath`. Also, all Logs will be put under the `logsFolder`, and everything will be logged.

### For Server (NGinx) management:

You creat a JSON file under `config/nginx`, i.e. a file called `webSite.json`:

    [
      {
        "enabled": "true",
        "type": "php",
        "port": "80",
        "name": "www.example.com",
        "root": "/var/www/example/site_folder",
        "locations": [
          {
            "path": "/",
              "tries": [
                {
                  "try": "$uri "
                },
                {
                  "try": "$uri/"
                },
                {
                  "try": "/index.php/$uri"
                }
              ]
          }
        ],
        "rewriteLocations": [
          {
            "path": "/exampleURL",
            "destination": "/correctURL"
          }
        ],
        "redirectLocations": [
          {
            "path": "/downloads",
            "uri": "downloads.example.com"
          }
        ]
      }
    ]


`enabled` defines if there will be a file created for this or not. If not enabled, this won't be published.

`rewriteLocations` work so as to rewrite URL segments, i.e. `www.example.com/Downloads` to `www.example.com/downloads`. You omit the URL (`www.example.com`) when writing the JSON.

ServerManager will parse this file, choose the appropriate model (From the `models` folder, using the `type` attribute) and create this file on the server path for you.


### For GitHooks:

You creat a JSON file under `config/gitHooks`, i.e. a file called `webSite.json`:

    {
      "actions": [
        {
          "header": "#!/bin/bash -l",
          "type": "post-update",
          "version": "php",
          "gitPath": "/var/repositories/example",
          "actions": [
            {
              "path": "/var/www/example/site_folder",
              "branch": "master"
            },
            {
              "path": "/var/www/example/site_folder",
              "branch": "testing"
            }
          ]
        }
      ]
    }

ServerManager will parse this file, choose the appropriate model (Using the `type` and `version` attributes), go to the `gitPath` and, under the `hooks` folder, create the appropriate `file` and populate it with the `header` (Useful for `/bin/bash --login` or similar) and then repeating the contents of the `model` for each action.