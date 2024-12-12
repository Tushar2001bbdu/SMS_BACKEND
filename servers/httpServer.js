const admin = require("firebase-admin");

// Firebase Initialization for students and teachers
const credentials = require("../student-account-key.json");
const credentialsOfTeachers = require("../teacher-account-key.json");

if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert(credentials),
  }, "students");
}

if (admin.apps.length === 1) {
  admin.initializeApp({
    credential: admin.credential.cert(credentialsOfTeachers),
  }, "teachers");
}

function initializeHttpServer(app) {
  // Your HTTP server configuration can go here (if needed)
  // Currently, it's just setting up the Express middleware and routes.
}

module.exports = { initializeHttpServer };
