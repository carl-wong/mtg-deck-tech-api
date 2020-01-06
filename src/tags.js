const express = require('express');

function createRouter(db) {
	const router = express.Router();

	// getTags
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

	// createTag
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

	// updateTag
	router.put('/Tags/:id', (req, res, next) => {
		db.query(
			'UPDATE Tag SET name=? WHERE id=?',
			[req.body.name, req.params.id],
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

	// mergeTags
	router.get('/Tags/Merge/:fromTagId/:intoTagId', function(req, res, next) {
		db.query(
			'UPDATE CardTagLink SET TagId=? WHERE TagId=?',
			[req.params.intoTagId, req.params.fromTagId],
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

	// deleteTag
	router.delete('/Tags/:id', function(req, res, next) {
		db.query(
			'DELETE FROM Tag WHERE id=?',
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

	return router;
}

module.exports = createRouter;