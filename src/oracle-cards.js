const express = require('express');

function createRouter(pool) {
	const router = express.Router();

	router.get('/OracleCards/Transform', function(req, res, next) {
		pool.getConnection(function(err, connection) {
			const query = "SELECT * FROM OracleCard WHERE layout='transform'";
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

	router.post('/OracleCards', (req, res, next) => {
		pool.getConnection(function(err, connection) {
			let whereClauses = [];

			// req.body.cards: string[]
			if (req.body.cards) {
				req.body.cards.forEach(card => {
					whereClauses.push(`name=${connection.escape(card)}`);
				});
			}

			if (whereClauses.length > 0) {
				const query = 'SELECT * FROM OracleCard WHERE ' + whereClauses.join(' OR ');
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

	return router;
}

module.exports = createRouter;