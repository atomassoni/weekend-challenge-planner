var express = require('express');
var router = express.Router();
var pg = require('pg');
var connectionString = 'postgres://localhost:5432/mu';

router.get('/', function (req, res) {
  pg.connect(connectionString, function (err, client, done) {
    if (err) {
      res.sendStatus(500);
    }

    client.query('SELECT first_name, last_name, name, breed, color, pets.id, check_in, check_out FROM pets' +
' JOIN owners ON owners.id = pets.owner_id' +
' LEFT OUTER JOIN visits ON visits.pet_id = pets.id',
function (err, result) {
      done();

      console.log(result.rows);

      res.send(result.rows);
    });
  });
});

router.post('/', function (req, res) {
  var pet = req.body;

  pg.connect(connectionString, function (err, client, done) {
    if (err) {
      res.sendStatus(500);
      console.log("first error");
    }

    client.query('INSERT INTO pets (name, breed, color, owner_id) ' +
                  'VALUES ($1, $2, $3, $4)',
                   [pet.petName, pet.breed, pet.color, pet.owner],
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

router.put('/:id', function (req, res) {
  var id = req.params.id;
  var pet = req.body;
  console.log(req.body);

  pg.connect(connectionString, function (err, client, done) {
    if (err) {
      res.sendStatus(500);
    }

    client.query('UPDATE pets ' +
                  'SET name = $1, ' +
                  'breed = $2, ' +
                  'color = $3' +
                  'WHERE id = $4',
                   [pet.name, pet.breed, pet.color, id],
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

    client.query('DELETE FROM visits ' +
                  'WHERE pet_id = $1',
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
});


module.exports = router;
