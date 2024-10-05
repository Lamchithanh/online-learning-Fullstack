// Import required modules
const express = require("express");
const bcrypt = require("bcrypt");
const db = require("./config/db");
require("dotenv").config();

// Create an Express app
const app = express();
const port = process.env.PORT || 8081;
// Connect to MySQL database
db.connect((err) => {
    if (err) {
        console.error("Error connecting to MySQL:", err);
        return;
    }
    console.log("Connected to MySQL");
});

db.query(`SELECT * FROM users WHERE username = "nghia";`, (err, results) => {
    if (err) {
        console.error("Error querying database:", err);
        return;
    }
    console.log(">>>>results: ", results);
});

// Define a route for login
// app.post("/Login", (req, res) => {
//     const { email, password } = req.body;

//     // Query the database to find the user
//     db.query(`SELECT * FROM users WHERE email = ?`, email, (err, results) => {
//         if (err) {
//             console.error("Error querying database:", err);
//             res.status(500).send({ error: "Internal Server Error" });
//             return;
//         }

//         if (results.length === 0) {
//             res.status(401).send({ error: "Invalid email or password" });
//             return;
//         }

//         const user = results[0];
//         const hashedPassword = user.password;

//         // Compare the provided password with the hashed password
//         bcrypt.compare(password, hashedPassword, (err, result) => {
//             if (err) {
//                 console.error("Error comparing passwords:", err);
//                 res.status(500).send({ error: "Internal Server Error" });
//                 return;
//             }

//             if (!result) {
//                 res.status(401).send({ error: "Invalid email or password" });
//                 return;
//             }

//             // Login successful, redirect to dashboard or whatever
//             res.send({ message: "Login successful" });
//         });
//     });
// });

// Start the server
app.listen(port, () => {
    console.log("Server started on port 8081");
});
