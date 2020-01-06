const express = require('express');

function createRouter(pool) {
	const router = express.Router();

	router.get('/OracleCards', function(req, res, next) {
		pool.getConnection(function(err, connection) {
			let whereClauses = [];

			if (req.query.layout) {
				whereClauses.push(`layout='${req.query.layout}'`);
			}

			if (req.query.name) {
				if (typeof req.query.name === 'string') {
					whereClauses.push(`name=${connection.escape(req.query.name)}`);
				} else if (Array.isArray(req.query.name)) {
					let subClauses = [];

					req.query.name.forEach(name => {
						subClauses.push(`name=${connection.escape(name)}`);
					});

					whereClauses.push(`(${subClauses.join(' OR ')})`);
				}
			}

			let query = 'SELECT COUNT(*) FROM OracleCard';// don't want to return the whole table by default
			if (whereClauses.length > 0) {
				query = 'SELECT * FROM OracleCard WHERE ' + whereClauses.join(' AND ');
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
	return router;
}

module.exports = createRouter;