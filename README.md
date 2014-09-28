# Comrat

Comrat sends you GitHub notifications through your desktop!

## Installation

Run `npm install` in the directory where you've cloned the project. This will install everything. Then, using [ngrok](ngrok.com) or your own server setup, ensure a URL points to your node server. 

Then, go to a GitHub repo you want to track (it currently has to be one you own), go to Settings > Webhooks & Services > Add Webhook. Add the URL you've just forwarded with `/post` appended to the end - e.g. `http://1234.ngrok.com/post` - to the payload URL. Select `Let me select individual events` in the trigger options menu and select `Push`, `Pull Request`, `Issues`, and `Member`. Of course, if you don't want to track any of these events specifically, don't check them.

Finally, just run your node server and do some stuff on GitHub!

## Todo

* Support for more events
* Dynamic webhooks
	* Listen for any URL, be it your repo or not
* Standalone app
	* Independent of node
	* Native, perhaps

If you think you can do any of the things in the todo or have your own idea, feel free to drop a pull request!