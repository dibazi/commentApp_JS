const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const path = require('path');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
// Set up MySQL connection pool
const connection = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'berthony',
    database: 'comments'
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
  connection.query('SELECT * FROM comments', (error, results) => {
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
    const sql = 'INSERT INTO comments (post, name, created_at, updated_at) VALUES (?, ?, ?, ?)';
    const values = [post, name, createdAt, createdAt];
  
    connection.query(sql, values, (error, results) => {
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
