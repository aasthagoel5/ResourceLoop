// This middleware factory returns a function that checks
// if the logged-in user's role is one of the allowed roles.
//
// Usage example: authorizeRoles("admin") or authorizeRoles("hospital", "ngo")
//
// IMPORTANT: This must run AFTER the "protect" middleware,
// since it relies on req.user (set by protect) to know who's asking.
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    // req.user was attached by the "protect" middleware after verifying the JWT
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. Requires one of these roles: ${allowedRoles.join(", ")}`,
      });
    }

    // User's role is allowed — continue to the actual route handler
    next();
  };
};

module.exports = authorizeRoles;