const express = require('express');

function createRouter(db) {
	const router = express.Router();

	router.get('/Profiles', function(req, res, next) {
		db.query(
			'SELECT * FROM Profile WHERE auth0Id=?',
			req.query.auth0Id,
			(error, results) => {
				if (error) {
					console.log(error);
					res.status(500).json(null);
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
					res.status(500).json(null);
				} else {
					res.status(200).json({ status: 'ok' });
				}
			}
		);
	});

	return router;
}

module.exports = createRouter;