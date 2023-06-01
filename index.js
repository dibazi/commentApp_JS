const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const dotenv = require('dotenv');
let result = dotenv.config();
const path = require('path');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

const dbHost = process.env.DB_HOST;
const dbUser = process.env.DB_USERNAME;
const dbPassword = process.env.DB_PASSWORD;
const dbName = process.env.DB_DATABASE;

// Set up MySQL connection pool
const pool = mysql.createPool({

  host: dbHost,
  user: dbUser,
  password: dbPassword,
  database: dbName,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Get a connection from the pool
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }

  console.log('Connected to the database!');

  // Perform database operations here

  // Release the connection
  connection.release();
});
app.use(express.static(__dirname = "public"));

const PORT = process.env.PORT || 3000;

// Set the view engine to EJS
app.set('view engine', 'ejs');

app.get('/comment', (req, res) => {
    res.render('comment.ejs');
});
// Route to render the EJS page
app.get('/comments', (req, res) => {
  pool.query('SELECT * FROM nndb_cloud_db123.comments', (error, results) => {
    if (error) {
      console.error('Error fetching data:', error);
      return res.status(500).send('Error fetching data');
    }

    res.render('comment', { comments: results }); // Render the EJS page with the retrieved comments data
  });
});


// Assuming you have an EJS page named "comment" with form inputs named "post" and "name"
app.post('/comment', (req, res) => {
    const { post, name } = req.body; // Fetch the values from the request body
    const createdAt = new Date(); // Get the current timestamp
  
    // Insert the data into the comments table
    const sql = 'INSERT INTO nndb_cloud_db123.comments (post, name, created_at, updated_at) VALUES (?, ?, ?, ?)';
    const values = [post, name, createdAt, createdAt];
  
    pool.query(sql, values, (error, results) => {
      if (error) {
        console.error('Error inserting data:', error);
        return res.status(500).send('Error inserting data');
      }
  
      console.log('Data inserted successfully!');
      return res.redirect('/comments'); // Redirect to the comments page after successful insertion
  

    });
  });

// Start the server
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
