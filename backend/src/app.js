const express = require('express');
const app = express();
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const passport = require("./config/passport");
const resourceRoutes = require("./routes/resourceRoutes");
const requestRoutes = require("./routes/requestRoutes");
const donationRoutes = require("./routes/donationRoutes");
const userRoutes = require("./routes/userRoutes");
const searchRoutes = require("./routes/searchRoutes");

//Middleware
app.use(express.json());
app.use(passport.initialize());

// Any request starting with /api/auth will be handled by authRoutes
app.use("/api/auth", authRoutes);
app.use("/api/admin/", adminRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/users", userRoutes);
app.use("/api/search", searchRoutes);

//Test Result
app.get('/', (req, res) => {
    res.send('🚀 Welcome to ResourceLoop API');
} );


module.exports = app;