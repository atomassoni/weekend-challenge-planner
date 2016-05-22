var express = require('express');
var router = express.Router();
var pg = require('pg');
var connectionString = 'postgres://localhost:5432/planner';


router.get('/', function(req, res) {
    pg.connect(connectionString, function(err, client, done) {
        if (err) {
            res.sendStatus(500);
        }

        client.query('SELECT * FROM tasks ' +
            'ORDER BY complete ASC, id ASC',
            function(err, result) {
                done();

                console.log(result.rows);

                res.send(result.rows);
            });
    });
});

router.post('/', function(req, res) {
    var task = req.body;
    console.log(task);
    pg.connect(connectionString, function(err, client, done) {
        if (err) {
            res.sendStatus(500);
        }

        client.query('INSERT INTO tasks (task) ' +
            'VALUES ($1)', [task.task],
            function(err, result) {
                done();

                if (err) {
                    res.sendStatus(500);
                    return;
                }

                res.sendStatus(201);
            });
    });
});

router.put('/:id', function(req, res) {
    var id = req.params.id;
    var task = req.body;
    console.log(req.body);

    pg.connect(connectionString, function(err, client, done) {
        if (err) {
            res.sendStatus(500);
        }


        client.query('UPDATE tasks ' +
            'SET complete = $1 ' +
            'WHERE id = $2', [task.setCompleteAs, id],
            function(err, result) {
                done();

                if (err) {
                    res.sendStatus(500);
                    return;
                }

                res.sendStatus(200);
            });
    });
});

router.delete('/:id', function(req, res) {
    var id = req.params.id;
    console.log(id);
    pg.connect(connectionString, function(err, client, done) {
        if (err) {
            console.log(err);
            res.sendStatus(500);
        }

        client.query('DELETE FROM tasks ' +
            'WHERE id = $1', [id],
            function(err, result) {
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
