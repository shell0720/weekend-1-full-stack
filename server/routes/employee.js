var express = require("express");
var router = express.Router();
var pg = require('pg');

var connectionString;

if (process.env.DATABASE_URL) {
  pg.defaults.ssl = true;
  connectionString = process.env.DATABASE_URL;
} else {
  connectionString = 'postgres://localhost:5432/employee_salary';
}

router.post('/', function (req, res) {
  console.log('body: ', req.body);
  var first_name = req.body.firstname;
  var last_name = req.body.lastname;
  var employee_id = req.body.number;
  var title = req.body.title;
  var salary = req.body.salary;

  // connect to DB
  pg.connect(connectionString, function (err, client, done) {
    if (err) {
      done();
      console.log('Error connecting to DB: ', err);
      res.status(500).send(err);
    } else {
      var result = [];

      var query = client.query('INSERT INTO people (first_name, last_name, employee_id, title, salary) VALUES ($1, $2, $3, $4, $5) ' +
      'RETURNING id, first_name, last_name, employee_id, title, salary', [first_name, last_name, employee_id, title, salary]);

      query.on('row', function (row) {
        result.push(row);
      });

      query.on('end', function () {
        done();
        res.send(result);
      });

      query.on('error', function (error) {
        console.log('Error running query:', error);
        done();
        res.status(500).send(error);
      });
    }
  });
});


router.get('/total', function (req, res) {
  // connect to DB
  pg.connect(connectionString, function(err, client, done){
    if (err) {
      done();
      console.log('Error connecting to DB: ', err);
      res.status(500).send(err);
    } else {
      var result = [];
      var query = client.query('SELECT salary FROM people;');

      query.on('row', function(row){
        result.push(row);
        return result;
      });

      query.on('end', function() {
        done();
        res.send(result);
      });

      query.on('error', function(error) {
        console.log('Error running query:', error);
        done();
        res.status(500).send(error);
      });
    }
  })
});

router.get('/', function (req, res) {
  // connect to DB
  pg.connect(connectionString, function(err, client, done){
    if (err) {
      done();
      console.log('Error connecting to DB: ', err);
      res.status(500).send(err);
    } else {
      var result = [];
      var query = client.query('SELECT * FROM people;');

      query.on('row', function(row){
        result.push(row);
      });

      query.on('end', function() {
        done();
        res.send(result);
      });

      query.on('error', function(error) {
        console.log('Error running query:', error);
        done();
        res.status(500).send(error);
      });
    }
  })
});


module.exports = router;
