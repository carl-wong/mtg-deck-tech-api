const express = require('express');

function createRouter(db) {
	const router = express.Router();

	// getTags
	router.get('/Profiles/:id/Tags', function(req, res, next) {
		let query = 'SELECT Tag.*, CTL.CardTagLinksCount FROM Tag LEFT JOIN (SELECT TagId, COUNT(*) AS CardTagLinksCount FROM CardTagLink GROUP BY TagId) AS CTL ON CTL.TagId = Tag.id';
		query += ' WHERE Tag.ProfileId=' + req.params.id;

		db.query(
			query,
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
			(error, results) => {
				if (error) {
					console.error(error);
					res.status(500).json({ isSuccess: false });
				} else {
					res.status(200).json({ isSuccess: true, id: results.insertId });
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
					res.status(500).json({ isSuccess: false });
				} else {
					res.status(200).json({ isSuccess: true });
				}
			}
		);
	});

	// mergeTags
	router.get('/Tags/Merge/:fromTagId/:intoTagId', function(req, res, next) {
		db.query(
			'UPDATE CardTagLink SET TagId=? WHERE TagId=?',
			[req.params.intoTagId, req.params.fromTagId],
			(error) => {
				if (error) {
					console.log(error);
					res.status(500).json({ isSuccess: false });
				} else {
					res.status(200).json({ isSuccess: true });
				}
			}
		);
	});

	// deleteTag
	router.delete('/Tags/:id', function(req, res, next) {
		db.query(
			'DELETE FROM Tag WHERE id=?',
			[req.params.id],
			(error) => {
				if (error) {
					console.log(error);
					res.status(500).json({ isSuccess: false });
				} else {
					res.status(200).json({ isSuccess: true });
				}
			}
		);
	});

	return router;
}

module.exports = createRouter;