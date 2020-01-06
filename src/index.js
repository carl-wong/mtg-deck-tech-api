const dbConfig = require('./connection');

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const apiOracleCards = require('./oracle-cards');
const apiProfiles = require('./profiles');
const apiTags = require('./tags');
const apiCardTagLinks = require('./card-tag-links');

const conn = mysql.createConnection({
	host: dbConfig.host,
	user: dbConfig.user,
	password: dbConfig.password,
	database: dbConfig.database,
});

conn.connect();

const port = process.env.PORT || 3000;

const app = express()
	.use(cors())
	.use(bodyParser.json())
	.use(apiOracleCards(conn))
	.use(apiProfiles(conn))
	.use(apiTags(conn))
	.use(apiCardTagLinks(conn));

app.listen(port, () => {
	console.log(`Express server running @ http://localhost:${port}`);
});