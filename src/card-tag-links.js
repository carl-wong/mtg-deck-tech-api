const express = require('express');

function createRouter(db) {
	const router = express.Router();

	router.get('/Profiles/:id/CardTagLinks', function(req, res, next) {
		let whereClauses = [];

		whereClauses.push(`ProfileId=${req.params.id}`);

		if (req.query.oracle_id) {
			if (typeof req.query.oracle_id === 'string') {
				whereClauses.push(`oracle_id=${db.escape(req.query.oracle_id)}`);
			} else if (Array.isArray(req.query.oracle_id)) {
				let subClauses = [];

				req.query.oracle_id.forEach(id => {
					subClauses.push(`oracle_id=${db.escape(id)}`);
				});

				whereClauses.push(`(${subClauses.join(' OR ')})`);
			}
		}

		if (req.query.TagId) {
			whereClauses.push(`TagId=${req.query.TagId}`);
		}

		let query = 'SELECT * FROM CardTagLink';
		if (whereClauses.length > 0) {
			query += ' WHERE ' + whereClauses.join(' AND ');
		}

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

	router.post('/CardTagLinks', (req, res, next) => {
		db.query(
			'INSERT INTO CardTagLink (id, ProfileId, TagId, oracle_id) VALUES (NULL,?,?,?)',
			[req.body.ProfileId, req.body.TagId, req.body.oracle_id],
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

	router.delete('/CardTagLinks/:id', function(req, res, next) {
		db.query(
			'DELETE FROM CardTagLink WHERE id=?',
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