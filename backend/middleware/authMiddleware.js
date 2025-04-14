// NOTE: This is a simplified auth middleware for demonstration purposes
// In a real application, you would use JWT for proper authentication

// Middleware to protect routes (requiring authentication)
exports.protect = (req, res, next) => {
  // For testing purposes, we'll just simulate an authenticated user
  // In a real app, you'd verify a JWT token from the request headers
  req.user = {
    id: '65f69b5d73c953b5a24d9a10', // Sample MongoDB ObjectId
    name: 'Test User',
    email: 'user@example.com',
    role: 'user'
  };
  next();
};

// Middleware to restrict access to admin users
exports.admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as an admin' });
  }
};