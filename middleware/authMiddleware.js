import jwt from 'jsonwebtoken';

function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer <token>"

  if (!token) return res.sendStatus(401); // Unauthorized

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // Forbidden
    req.user = user;
    next();
  });
}

export default authMiddleware;

// notes for Matthew
    // This verifies the tokens for protected route usage
    // if no token is provided, the user cannot visit protected routes
    // tokens are verified with jwt.verify()