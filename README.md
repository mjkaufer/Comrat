# Comrat

Comrat sends you GitHub notifications through your desktop!

## Installation

Run `npm install` in the directory where you've cloned the project. This will install everything. Ngrok will automatically tunnel an ngrok url to your node app. Copy the URL outputted - you'll use it in the next step.

Then, go to a GitHub repo you want to track (it currently has to be one you own), go to `Settings > Webhooks & Services > Add Webhook`. Add the ngrok url with `/post` appended to the end - e.g. `http://1234.ngrok.com/post` - to the payload URL. Select `Let me select individual events` in the trigger options menu and select `Push`, `Pull Request`, `Issues`, and `Member`. Of course, if you don't want to track any of these events specifically, don't check them.

Now, with your node server running, you'll receive notifications for any of the supported events below!

## Supported Events

* Pushes
* Pull Requests
* Issues
* Member Additions

## Screenshots

Push Notification

![Push Notification](http://i.imgur.com/PDaQiKw.png)

## Todo

* Support for more events
* Dynamic webhooks
	* Listen for any URL, be it your repo or not
* Standalone app
	* Independent of node
	* Native, perhaps

If you think you can do any of the things in the todo or have your own idea, feel free to drop a pull request!
