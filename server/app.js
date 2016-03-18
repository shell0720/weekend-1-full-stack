var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var pg = require('pg');

var connectionString;

if (process.env.DATABASE_URL) {
  pg.defaults.ssl = true;
  connectionString = process.env.DATABASE_URL;
} else {
  connectionString = 'postgres://localhost:5432/employee_salary';
}

pg.connect(connectionString, function (err, client, done) {
  if (err) {
    console.log('Error connecting to DB!', err);
    //TODO end process with error code
  } else {
    var query = client.query('CREATE TABLE IF NOT EXISTS people (' +
    'id SERIAL PRIMARY KEY,' +
    'first_name varchar(80) NOT NULL,' +
    'last_name varchar(80) NOT NULL,' +
    'employee_id varchar(80) NOT NULL,' +
    'title varchar(80) NOT NULL,' +
    'salary varchar(80) NOT NULL);'
  );

  query.on('end', function(){
    console.log('Successfully ensured schema exists');
    done();
  });

  query.on('error', function() {
    console.log('Error creating schema!');
    done();
  });
}
});

var app = express();
var port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));



// example POST request using curl
app.post('/people', function (req, res) {
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

app.get('/people', function (req, res) {
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

app.get('/*', function(req, res){
  var filename = req.params[0] || 'views/index.html';
  res.sendFile(path.join(__dirname, '/public/', filename)); // ..../server/public/filename
});

app.listen(port, function() {
  console.log('Listening for requests on port', port);
});
