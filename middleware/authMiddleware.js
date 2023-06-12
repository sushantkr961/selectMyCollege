const authMiddleware = (req, res, next) => {
  // Check if user is authenticated
  if (req.session.isAuthenticated && req.session.user.role === "admin") {
    // User is authenticated and has admin role
    next();
  } else {
    req.session.message = {
      type: "danger",
      message: "You are not authorized to access this page",
    };
    res.redirect("/login"); // Redirect to a login page or show an error message
  }
};

module.exports = authMiddleware;
