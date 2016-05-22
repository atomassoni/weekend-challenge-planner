var express = require('express');
var router = express.Router();
var pg = require('pg');
var connectionString = 'postgres://localhost:5432/mu';

//when getOwners is called, gets owners table info
router.get('/', function (req, res) {
  pg.connect(connectionString, function (err, client, done) {
    if (err) {
      res.sendStatus(500);
    }

    client.query('SELECT first_name, last_name, id FROM owners', function (err, result) {
      done();

      console.log(result.rows);

      res.send(result.rows);
    });
  });
});

router.post('/', function (req, res) {
  var owner = req.body;
console.log(owner);
  pg.connect(connectionString, function (err, client, done) {
    if (err) {
      res.sendStatus(500);
    }

    client.query('INSERT INTO owners (first_name, last_name) ' +
                  'VALUES ($1, $2)',
                   [owner.firstName, owner.lastName],
                 function (err, result) {
                   done();

                   if (err) {
                     res.sendStatus(500);
                     return;
                   }

                   res.sendStatus(201);
                 });
  });
});

/*router.put('/:id', function (req, res) {
  var id = req.params.id;
  var movie = req.body;
  console.log(req.body);

  pg.connect(connectionString, function (err, client, done) {
    if (err) {
      res.sendStatus(500);
    }

    client.query('UPDATE movies ' +
                  'SET title = $1, ' +
                  'year = $2, ' +
                  'director = $3' +
                  'WHERE movie_id = $4',
                   [movie.title, movie.year, movie.director, id],
                 function (err, result) {
                   done();

                   if (err) {
                     res.sendStatus(500);
                     return;
                   }

                   res.sendStatus(200);
                 });
  });
});

router.delete('/:id', function (req, res) {
  var id = req.params.id;
  console.log(id);
  pg.connect(connectionString, function (err, client, done) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    }

    client.query('DELETE FROM movies ' +
                  'WHERE movie_id = $1',
                   [id],
                 function (err, result) {
                   done();

                   if (err) {
                     console.log(err);
                     res.sendStatus(500);
                     return;
                   }

                   res.sendStatus(200);
                 });
  });
});*/


module.exports = router;
