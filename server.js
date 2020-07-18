var express = require("express"); // include the express module
var app = express(); // create an express application
var bodyparser = require('body-parser'); // helps in extracting the body portion of an incoming request stream
var fs = require("fs"); // fs module - provides an API for interacting with the file system
var session = require('express-session'); // helps in managing user sessions
var crypto = require('crypto'); // native js function for hashing messages with the SHA-256 algorithm
var mysql = require("mysql"); // include the mysql module
var failLoginCheck = 0

// apply the body-parser middleware to all incoming requests
app.use(bodyparser());
//app.use(bodyparser.urlencoded({ extended: true}));

// use express-session
// in mremory session is sufficient for this assignment
app.use(session({
  secret: "csci4131secretkey",
  saveUninitialized: true,
  resave: false}
));

// server listens on port 9007 for incoming connections
app.listen(process.env.PORT || 9001, () => console.log('Listening on port 9001!'));

app.get('/',function(req, res) {
	res.sendFile(__dirname + '/client/login.html');
});

// // GET method route for the contact page.
// It serves contact.html present in client folder
app.get('/contact',function(req, res) {
  if(!req.session.value)
  {
    res.sendFile(__dirname + '/client/login.html');
  }
  else
  {
		req.session.value += 1;
  }
	res.sendFile(__dirname + '/client/contact.html');
});

// GET method route for the addContact page.
// It serves addContact.html present in client folder
app.get('/addContact',function(req, res) {
  if(!req.session.value)
  {
    res.sendFile(__dirname + '/client/login.html');
  }
  else
  {
		req.session.value += 1;
  }
	res.sendFile(__dirname + '/client/addContact.html');
});

//GET method for stock page
app.get('/stock', function (req, res) {
  if(!req.session.value)
  {
    res.sendFile(__dirname + '/client/login.html');
  }
  else
  {
		req.session.value += 1;
  }
	res.sendFile(__dirname + '/client/stock.html');
});

// GET method route for the login page.
// It serves login.html present in client folder
app.get('/login',function(req, res) {
  res.sendFile(__dirname + '/client/login.html');
});

// GET method to return the list of contacts
// The function queries the tbl_contacts table for the list of contacts
// and sends the response back to client
app.get('/getListOfContacts', function(req, res) {
  var con = mysql.createConnection({
    host: "us-cdbr-east-06.cleardb.net",
    user: "b2a8435513328d", // replace with the database user provided to you
    password: "8e9a944d", // replace with the database password provided to you
    database: "heroku_2a68ebc99e9f948", // replace with the database user provided to you
    port: 3306
  });

  con.connect(function(err) {
    if (err) {
      throw err;
    };
  });

  con.query('SELECT * FROM tbl_contacts', function(err, result) {
    if(err) throw err;
    res.json(result); //this is it
  });
});

// POST method to insert details of a new contact to tbl_contacts table
// DONE
app.post('/postContact', function(req, res) {
  var reqBody = "";
  //server starts receiving the form data
  req.on('data', function(data) {
    reqBody += data;
  }); //server has received all the form data

  const qs = require('querystring');

  //parse reqbody to get all values from form
  var postObj = qs.parse(reqBody);

  var rowTobeInserted = {
    contact_name: req.body.contact_name,
    contact_email: req.body.contact_email,
    contact_address: req.body.contact_address,
    contact_phone: req.body.contact_phone,
    contact_favoriteplace: req.body.contact_favoriteplace,
    contact_favoriteplaceurl: req.body.contact_favoriteplaceurl
  };

  var con = mysql.createConnection({
    host: "us-cdbr-east-06.cleardb.net",
    user: "b2a8435513328d", // replace with the database user provided to you
    password: "8e9a944d", // replace with the database password provided to you
    database: "heroku_2a68ebc99e9f948", // replace with the database user provided to you
    port: 3306
  });

  con.connect(function(err) {
    if (err) {
      throw err;
    };
  });

  con.query('INSERT tbl_contacts SET ?', rowTobeInserted, function(err, result) {
    if(err) throw err;
  });

  res.sendFile(__dirname + '/client/contact.html');
});

// POST method to validate user login
// upon successful login, user session is created
app.post('/sendLoginDetails', function(req, res) {
  var reqBody = "";

  //server receiving the form data
  req.on('data', function(data) {
    reqBody += data;
  });

  const qs = require('querystring');

  //parse reqbody to get all values from form
  var postObj = qs.parse(reqBody);

  var con = mysql.createConnection({
    host: "us-cdbr-east-06.cleardb.net",
    user: "b2a8435513328d", // replace with the database user provided to you
    password: "8e9a944d", // replace with the database password provided to you
    database: "heroku_2a68ebc99e9f948", // replace with the database user provided to you
    port: 3306
  });

  con.connect(function(err) {
    if (err) {
      throw err;
    };
  });

  con.query('SELECT * FROM tbl_accounts', function(err, result) {
    if(err) throw err;

    if((req.body.acc_login == result[0].acc_login) && (crypto.createHash('sha256').update(req.body.acc_password).digest('base64') == result[0].acc_password))
    {

      req.session.value = 1;
      failLoginCheck = 1; //correct credentials
      res.sendFile(__dirname + '/client/contact.html');
    }
    else
    {
      failLoginCheck = -1; //when -1 invalid login message
      res.sendFile(__dirname + '/client/login.html');
    }
  });
});

// log out of the application
// destroy user session
app.get('/logout', function(req, res) {
  req.session.destroy();
  res.sendFile(__dirname + '/client/login.html');
});

app.get('/failedLogin', function(req, res) {
  res.json(failLoginCheck); //tells client if failed login
});

// middle ware to serve static files
app.use('/client', express.static(__dirname + '/client'));


// function to return the 404 message and error to client
app.get('*', function(req, res) {
  // add details
  res.sendStatus(404);
});
