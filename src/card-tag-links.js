const express = require('express');

function createRouter(pool) {
	const router = express.Router();

	// getCardTagLink / getCardTagLinks
	router.get('/Profiles/:id/CardTagLinks', function(req, res, next) {
		pool.getConnection(function(err, connection) {
			let whereClauses = [];

			whereClauses.push(`CardTagLink.ProfileId=${req.params.id}`);

			if (req.query.oracle_id) {
				if (typeof req.query.oracle_id === 'string') {
					whereClauses.push(`oracle_id=${connection.escape(req.query.oracle_id)}`);
				} else if (Array.isArray(req.query.oracle_id)) {
					let subClauses = [];

					req.query.oracle_id.forEach(id => {
						subClauses.push(`oracle_id=${connection.escape(id)}`);
					});

					whereClauses.push(`(${subClauses.join(' OR ')})`);
				}
			}

			if (req.query.TagId) {
				whereClauses.push(`TagId=${req.query.TagId}`);
			}

			let query = 'SELECT CardTagLink.*, Tag.name as TagName FROM CardTagLink LEFT JOIN Tag ON Tag.id = CardTagLink.TagId';
			if (whereClauses.length > 0) {
				query += ' WHERE ' + whereClauses.join(' AND ');
			}

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

	router.post('/Profiles/:id/CardTagLinks', (req, res, next) => {
		pool.getConnection(function(err, connection) {
			let whereClauses = [];

			whereClauses.push(`CardTagLink.ProfileId=${req.params.id}`);

			// req.body.oracle_ids: string[]
			if (req.body.oracle_ids) {
				let subClauses = [];

				req.body.oracle_ids.forEach(oracle_id => {
					subClauses.push(`oracle_id=${connection.escape(oracle_id)}`);
				});

				whereClauses.push(`(${subClauses.join(' OR ')})`);
			}

			if (whereClauses.length > 0) {
				const query = 'SELECT CardTagLink.*, Tag.name as TagName FROM CardTagLink LEFT JOIN Tag ON Tag.id = CardTagLink.TagId WHERE' + whereClauses.join(' AND ');
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
			} else {
				res.status(500).json(null);
			}
		});
	});

	// createCardTagLink
	router.post('/CardTagLinks', (req, res, next) => {
		pool.getConnection(function(err, connection) {
			connection.query(
				'INSERT INTO CardTagLink (id, ProfileId, TagId, oracle_id) VALUES (NULL,?,?,?)',
				[req.body.ProfileId, req.body.TagId, req.body.oracle_id],
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

	// deleteCardTagLink
	router.delete('/CardTagLinks/:id', function(req, res, next) {
		pool.getConnection(function(err, connection) {
			connection.query(
				'DELETE FROM CardTagLink WHERE id=?',
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