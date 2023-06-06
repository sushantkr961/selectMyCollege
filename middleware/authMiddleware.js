const authMiddleware = (req, res, next) => {
  // Check if user is authenticated
  if (req.session.isAuthenticated && req.session.user.role === "admin") {
    // User is authenticated and has admin role
    next();
  } else {
    // User is not authenticated or doesn't have admin role
    res.redirect("/login"); // Redirect to a login page or show an error message
  }
};

module.exports = authMiddleware;
