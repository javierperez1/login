/*
TO DO:
-----
READ ALL COMMENTS AND REPLACE VALUES ACCORDINGLY
*/

var mysql = require("mysql");

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
  console.log("Connected!");
    var sql = `CREATE TABLE tbl_contacts(contact_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                                         contact_name VARCHAR(30),
                                         contact_email VARCHAR(30),
                                         contact_address VARCHAR(80),
                                         contact_phone VARCHAR(30),
                                         contact_favoriteplace VARCHAR(30),
                                         contact_favoriteplaceurl VARCHAR(1024))`;
  con.query(sql, function(err, result) {
    if(err) {
      throw err;
    }
    console.log("Table created");
  });
});
