servermanager
=============

NOT WORKING AS OF YET.

ServerManager is a Node Application to maintain Nginx Configuration Files and Git Hooks.

How it's gonna work:


For Server (NGinx) management:

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
            "path": "/exampleURL",
            "destination": "/correctURL"
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


The ServerManager will parse this file, choose the appropriate model (Using the `type` attribute) and create this file in the path for your


For GitHooks:
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
            "branch": "master"
          }
        }
      }
    }

The ServerManager will parse this file, choose the appropriate model (Using the `type` attribute), go to the gitPath and, under the `hooks` folder, create the appropriate `file` and populate it repeating the contents of the `model` for each action.