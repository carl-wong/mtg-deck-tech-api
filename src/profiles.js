const express = require('express');

function createRouter(db) {
	const router = express.Router();

	router.get('/Profiles', function(req, res, next) {
		let whereClauses = [];

		if (req.params.auth0Id) {
			whereClauses.push(`auth0Id='${req.params.auth0Id}'`);
		}

		let query = 'SELECT * FROM Profile';
		if (whereClauses.length > 0) {
			query += ' WHERE ' + whereClauses.join(' AND ');
		}

		db.query(
			query,
			(error, results) => {
				if (error) {
					console.log(error);
					res.status(500).json({ status: 'error' });
				} else {
					res.status(200).json(results);
				}
			}
		);
	});

	router.post('/Profiles', (req, res, next) => {
		db.query(
			'INSERT INTO Profile (id, auth0Id) VALUES (NULL,?)',
			[req.body.auth0Id],
			(error) => {
				if (error) {
					console.error(error);
					res.status(500).json({ status: 'error' });
				} else {
					res.status(200).json({ status: 'ok' });
				}
			}
		);
	});

	return router;
}

module.exports = createRouter;