
const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
const authenticateStudentToken = async (req, res, next) => {
  // Extract the token from the Authorization header
  const idToken = req.headers.authorization;

  if (!idToken) {
    // If no token is provided, return unauthorized error
    return res.status(401).json({ message: 'Unauthorized, no token provided' });
  }

  try {
    // Verify the ID token
    const decodedToken = await admin.app('students').auth().verifyIdToken(idToken);
    // Attach the decoded token (user data) to the request object
    req.user = decodedToken;
    // Move to the next middleware or route handler
    next();
  } catch (error) {
    // If token verification fails, return forbidden error
    console.error('Error verifying token:', error);
    return res.status(403).json({ message: 'Invalid token' });
  }
};
// Initialize Firebase Admin SDK
const authenticateTeacherToken = async (req, res, next) => {
  // Extract the token from the Authorization header
  const idToken = req.headers.authorization;

  if (!idToken) {
    // If no token is provided, return unauthorized error
    return res.status(401).json({ message: 'Unauthorized, no token provided' });
  }

  try {
    // Verify the ID token
    const decodedToken = await admin.app('teachers').auth().verifyIdToken(idToken);
    // Attach the decoded token (user data) to the request object
    req.user = decodedToken;
    // Move to the next middleware or route handler
    next();
  } catch (error) {
    // If token verification fails, return forbidden error
    console.error('Error verifying token:', error);
    return res.status(403).json({ message: 'Invalid token' });
  }
};
module.exports = {authenticateStudentToken,authenticateTeacherToken};
