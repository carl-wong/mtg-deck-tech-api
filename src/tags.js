const express = require('express');

function createRouter(db) {
	const router = express.Router();

	router.get('/Tags/:id', function(req, res, next) {
		db.query(
			'SELECT * FROM Tag WHERE id=? AND ProfileId=?',
			[req.params.id, req.query.ProfileId],
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

	router.get('/Profiles/:id/Tags', function(req, res, next) {
		db.query(
			'SELECT * FROM Tag WHERE ProfileId=?',
			[req.params.id],
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

	router.post('/Tags', (req, res, next) => {
		db.query(
			'INSERT INTO Tag (id, ProfileId, name) VALUES (NULL,?,?)',
			[req.body.ProfileId, req.body.name],
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

	router.delete('/Tags/:id', function(req, res, next) {
		db.query(
			'DELETE FROM Tag WHERE id=? AND ProfileId=?',
			[req.params.id, req.query.ProfileId],
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

	return router;
}

module.exports = createRouter;