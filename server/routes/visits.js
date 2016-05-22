var express = require('express');
var router = express.Router();
var pg = require('pg');
var connectionString = 'postgres://localhost:5432/mu';

router.get('/', function (req, res) {
  pg.connect(connectionString, function (err, client, done) {
    if (err) {
      res.sendStatus(500);
    }

    client.query('SELECT * FROM visits', function (err, result) {
      done();

      console.log(result.rows);

      res.send(result.rows);
    });
  });
});

router.post('/', function (req, res) {
  var visit = req.body;

  pg.connect(connectionString, function (err, client, done) {
    if (err) {
      res.sendStatus(500);
      console.log("first error");
    }

    client.query('INSERT INTO visits (check_in, pet_id) ' +
                  'VALUES ($1, $2)',
                   [visit.checkIn, visit.petID],
                 function (err, result) {
                   done();

                   if (err) {
                     res.sendStatus(500);
                     console.log("second error");
                     return;
                   }

                   res.sendStatus(201);
                 });
  });
});

module.exports = router;
