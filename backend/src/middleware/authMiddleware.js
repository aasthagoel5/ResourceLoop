const jwt = require("jsonwebtoken");

//This functionruns BEFORE a protectedroute's control.
//It checks if the request has a valid JWT token in the Authorization header.
const protect = (req, res, next) => {
  try {
    //Token are sent in the header like: Authirization: Bearer <token>
    const authHeader = req.headers.authorization;

    //if no header , or it doesn't start with "Bearer ", reject the request
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }

    //Extract the token from the header
    const token = authHeader.split(" ")[1];

    //Verify the token using the secret key from .env
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //Attach the decoded user info (userId and role) to the request object
    //so the nextcontroller function can access it.
    req.user = decoded;

    //Call the next middleware/controller in the stack
    next();
  } catch (error) {
    //If token verification fails (e.g. expired, invalid), reject the request
    res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = protect;
