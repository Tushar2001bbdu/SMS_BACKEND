const express = require("express");
const http = require("http");
const cors = require("cors");
const connectToMongo = require("./config/db");
const { initializeWebSocket } = require("./servers/websocketServer");
const initializeGraphQLServer = require("./servers/graphqlserver"); // updated to work with existing app
const {initializeHttpServer}=require("./servers/httpServer")
const app = express();
const mainServer = http.createServer(app);
const port = process.env.PORT || 3001;

// DB connection
connectToMongo();



// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/app/users", require("./routes/students"));
app.use("/app/details", require("./routes/management"));
app.use("/app/teachers", require("./routes/teachers"));
app.use("/app/attendance", require("./routes/attendance"));
app.use("/app/onlineClass", require("./routes/onlineclass"));
app.use("/app/exam", require("./routes/onlineexam"));
app.use("/app/assignments", require("./routes/assignment"));
initializeHttpServer(app);
// Attach GraphQL middleware to existing app
initializeGraphQLServer(app);

// WebSocket and PeerJS attach to the same server
initializeWebSocket(mainServer);


// Start Server
mainServer.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
