# MTG DeckTech API

## Development Server

Run `node src/index.js` to get the API running.

Ensure that `src/connection.js` is populated with your database details:

```
module.exports = {
	host: HOSTNAME,
	user: USERNAME,
	password: PASSWORD,
	database: DATABASE,
};
```

## Apache Deployment Prerequisites

Assuming `npm` is installed on your server, run `sudo npm install -g pm2` to install PM2 globally. It will be used to keep the server running permanently.

## Deployment

Easiest way is using GitHub to sync the repo to `public_html/[root]`, but you can just upload the entire repository to the folder.

Ensure that `.htaccess` in `public_html/[root]` (or where the project will live) contains the following:
```
DirectoryIndex disabled
RewriteEngine On
RewriteRule ^(.*)$ http://127.0.0.1:3000/$1 [P,L]
RewriteRule ^$ http://127.0.0.1:3000/ [P,L]
```

This ensures that all requests sent to this path will be redirected to our `localhost` server instead.

Run `pm2 start src/index.js --name CUSTOM_NAME` to start the server. Give it a custom name to make it easily identifiable if it ever stops or needs restarting.

`pm2 list` prints out the status of all processes. `pm2 stop CUSTOM_NAME` stops the server and `pm2 delete CUSTOM_NAME` removes it from the listing.

This ensures API requests are redirected properly to Express.