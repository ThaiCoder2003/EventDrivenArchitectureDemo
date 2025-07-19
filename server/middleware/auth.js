const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, 'your_jwt_secret');
    req.user = decoded; // now accessible via req.user
    next();
  } catch {
    return res.status(401).json({ error: 'Unauthorized' });
  }
};

