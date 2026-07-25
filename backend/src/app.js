const express = require('express');
const app = express();

//Middleware
app.use(express.json());

//Test Result
app.get('/', (req, res) => {
    res.send('🚀 Welcome to ResourceLoop API');
} );

module.exports = app;