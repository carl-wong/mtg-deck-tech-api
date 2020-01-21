const config = require('./config');

const express = require('express');

// CORS setup
const cors = require('cors');
const corsWhitelist = [
	'http://localhost:4200',
	'https://scry-x.com'
];
const corsOptions = {
	origin: function(origin, callback) {
		if (origin) {
			if (corsWhitelist.indexOf(origin) !== -1) {
				callback(null, true);
			} else {
				callback(new Error('Not allowed by CORS'));
			}
		} else {
			// undefined origin ==> local request
			callback(null, true);
		}
	}
}

const bodyParser = require('body-parser');

// database details
const mysql = require('mysql');
const dbConfig = require('./connection');
const pool = mysql.createPool({
	multipleStatements: true,
	connectionLimit: 10,
	host: dbConfig.host,
	user: dbConfig.user,
	password: dbConfig.password,
	database: dbConfig.database,
});

// API controllers
const apiOracleCards = require('./oracle-cards');
const apiProfiles = require('./profiles');
const apiTags = require('./tags');
const apiCardTagLinks = require('./card-tag-links');

const port = process.env.PORT || config.port || 3000;

const app = express()
	.use(cors(corsOptions))
	.use(bodyParser.json())
	.use(apiOracleCards(pool))
	.use(apiProfiles(pool))
	.use(apiTags(pool))
	.use(apiCardTagLinks(pool));

app.listen(port, () => {
	console.log(`Express server running @ http://localhost:${port}`);
});