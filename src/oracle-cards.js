const express = require('express');

function createRouter(db) {
	const router = express.Router();

	router.get('/OracleCards', function(req, res, next) {
		let whereClauses = [];

		if (req.query.layout) {
			whereClauses.push(`layout='${req.query.layout}'`);
		}

		if (req.query.name) {
			if (typeof req.query.name === 'string') {
				whereClauses.push(`name=${db.escape(req.query.name)}`);
			} else if (Array.isArray(req.query.name)) {
				let subClauses = [];

				req.query.name.forEach(name => {
					subClauses.push(`name=${db.escape(name)}`);
				});

				whereClauses.push(`(${subClauses.join(' OR ')})`);
			}
		}

		let query = 'SELECT * FROM OracleCard';
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
	return router;
}

module.exports = createRouter;