const jwt = require('jsonwebtoken');

// Middleware to verify JWT token (required)
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(403).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    req.isGuest = false;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized - Invalid token' });
  }
};

// Middleware for optional authentication (allows guest access)
const optionalAuth = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    // No token provided - mark as guest user
    req.userId = 'guest-' + Date.now(); // Temporary guest ID
    req.isGuest = true;
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    req.isGuest = false;
    next();
  } catch (error) {
    // Invalid token - still allow as guest
    req.userId = 'guest-' + Date.now();
    req.isGuest = true;
    next();
  }
};

module.exports = { verifyToken, optionalAuth };
