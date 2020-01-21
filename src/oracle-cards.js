const express = require('express');

function createRouter(pool) {
	const router = express.Router();

	router.get('/Profiles/:id/Decklist', function(req, res, next) {
		pool.getConnection(function(err, connection) {
			let nameClauses = [];

			if (req.query.name) {
				if (typeof req.query.name === 'string') {
					nameClauses.push(`name=${connection.escape(req.query.name)}`);
				} else if (Array.isArray(req.query.name)) {
					let subClauses = [];

					req.query.name.forEach(name => {
						subClauses.push(`name=${connection.escape(name)}`);
					});

					nameClauses.push(`(${subClauses.join(' OR ')})`);
				}
			}

			if (nameClauses.length === 0) {
				console.log('No card names found in req.query.name');
				connection.release();
				res.status(500).json(null);
			} else {
				let selectOracleCards = `SELECT * FROM OracleCard WHERE ${nameClauses.join(' AND ')}`;
				let selectCardLinkTags = `SELECT * FROM CardTagLink WHERE ProfileId=${req.params.id} AND oracle_id IN (SELECT oracle_id FROM OracleCard WHERE ${nameClauses.join(' AND ')})`;

				connection.query(
					`${selectOracleCards} ; ${selectCardLinkTags}`,
					(error, results) => {
						connection.release();

						if (error) {
							console.log(error);
							res.status(500).json(null);
						} else {
							res.status(200).json({ OracleCards: results[0], CardTagLinks: results[1] });
						}
					}
				);
			}
		});
	});

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