const express = require('express');
const app = express();
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");

//Middleware
app.use(express.json());

// Any request starting with /api/auth will be handled by authRoutes
app.use("/api/auth", authRoutes);
app.use("/api/admin/", adminRoutes);


//Test Result
app.get('/', (req, res) => {
    res.send('🚀 Welcome to ResourceLoop API');
} );


module.exports = app;