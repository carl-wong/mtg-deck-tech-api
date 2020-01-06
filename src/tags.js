const express = require('express');

function createRouter(pool) {
	const router = express.Router();

	// getTags
	router.get('/Profiles/:id/Tags', function(req, res, next) {
		pool.getConnection(function(err, connection) {
			let query = 'SELECT Tag.*, CTL.CardTagLinksCount FROM Tag LEFT JOIN (SELECT TagId, COUNT(*) AS CardTagLinksCount FROM CardTagLink GROUP BY TagId) AS CTL ON CTL.TagId = Tag.id';
			query += ' WHERE Tag.ProfileId=' + req.params.id;

			connection.query(
				query,
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

	// createTag
	router.post('/Tags', (req, res, next) => {
		pool.getConnection(function(err, connection) {
			connection.query(
				'INSERT INTO Tag (id, ProfileId, name) VALUES (NULL,?,?)',
				[req.body.ProfileId, req.body.name],
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

	// updateTag
	router.put('/Tags/:id', (req, res, next) => {
		pool.getConnection(function(err, connection) {
			connection.query(
				'UPDATE Tag SET name=? WHERE id=?',
				[req.body.name, req.params.id],
				(error) => {
					connection.release();

					if (error) {
						console.error(error);
						res.status(500).json({ isSuccess: false });
					} else {
						res.status(200).json({ isSuccess: true });
					}
				}
			);
		});
	});

	// mergeTags
	router.get('/Tags/Merge/:fromTagId/:intoTagId', function(req, res, next) {
		pool.getConnection(function(err, connection) {
			connection.query(
				'UPDATE CardTagLink SET TagId=? WHERE TagId=?',
				[req.params.intoTagId, req.params.fromTagId],
				(error) => {
					connection.release();

					if (error) {
						console.log(error);
						res.status(500).json({ isSuccess: false });
					} else {
						res.status(200).json({ isSuccess: true });
					}
				}
			);
		});
	});

	// deleteTag
	router.delete('/Tags/:id', function(req, res, next) {
		pool.getConnection(function(err, connection) {
			connection.query(
				'DELETE FROM Tag WHERE id=?',
				[req.params.id],
				(error) => {
					connection.release();

					if (error) {
						console.log(error);
						res.status(500).json({ isSuccess: false });
					} else {
						res.status(200).json({ isSuccess: true });
					}
				}
			);
		});
	});

	return router;
}

module.exports = createRouter;