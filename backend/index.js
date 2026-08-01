require('dotenv').config();

console.log("CALLBACK URL:", JSON.stringify(process.env.GOOGLE_CALLBACK_URL));
console.log("CLIENT ID:", JSON.stringify(process.env.GOOGLE_CLIENT_ID));

const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']); 


const connectDB = require('./src/config/db');

const app=require('./src/app');
const port = 5000;

//Connect to Database
connectDB();


//Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

const sendEmail = require("./src/utils/sendEmail"); // adjust path if needed

