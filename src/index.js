const dbConfig = require('./connection');

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const apiOracleCards = require('./oracle-cards');
const apiProfiles = require('./profiles');
const apiTags = require('./tags');
const apiCardTagLinks = require('./card-tag-links');

const pool = mysql.createPool({
	connectionLimit: 10,
	host: dbConfig.host,
	user: dbConfig.user,
	password: dbConfig.password,
	database: dbConfig.database,
});

const port = process.env.PORT || 3000;

const app = express()
	.use(cors())
	.use(bodyParser.json())
	.use(apiOracleCards(pool))
	.use(apiProfiles(pool))
	.use(apiTags(pool))
	.use(apiCardTagLinks(pool));

app.listen(port, () => {
	console.log(`Express server running @ http://localhost:${port}`);
});