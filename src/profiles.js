const express = require('express');

function createRouter(pool) {
	const router = express.Router();

	router.get('/Profiles', function(req, res, next) {
		pool.getConnection(function(err, connection) {
			connection.query(
				'SELECT * FROM Profile WHERE auth0Id=?',
				req.query.auth0Id,
				(error, results) => {
					connection.release();

					if (error) {
						console.log(error);
						res.status(500).json(null);
					} else {
						res.status(200).json(results);
					}
				}
			);
		});
	});

	router.post('/Profiles', (req, res, next) => {
		pool.getConnection(function(err, connection) {
			connection.query(
				'INSERT INTO Profile (id, auth0Id) VALUES (NULL,?)',
				[req.body.auth0Id],
				(error, results) => {
					connection.release();

					if (error) {
						console.error(error);
						res.status(500).json({ isSuccess: false });
					} else {
						res.status(200).json({ isSuccess: true, id: results.insertId });
					}
				}
			);
		});
	});

	return router;
}

module.exports = createRouter;