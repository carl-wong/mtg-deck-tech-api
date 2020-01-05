const dbConfig = require('./connection');

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const apiOracleCards = require('./oracle-cards');
const apiProfiles = require('./profiles');
const apiTags = require('./tags');
const apiCardTagLinks = require('./card-tag-links');

const connection = mysql.createConnection({
	host: dbConfig.host,
	user: dbConfig.user,
	password: dbConfig.password,
	database: dbConfig.database,
});

connection.connect();

const port = process.env.PORT || 3000;

const app = express()
	.use(cors())
	.use(bodyParser.json())
	.use(apiOracleCards(connection))
	.use(apiProfiles(connection))
	.use(apiTags(connection))
	.use(apiCardTagLinks(connection));

app.listen(port, () => {
	console.log(`Express server running @ http://localhost:${port}`);
});