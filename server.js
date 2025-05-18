const express = require("express");
const http = require("http");
const cors = require("cors");
const connectToMongo = require("./config/db");
const { initializeWebSocket } = require("./servers/websocketServer");
const initializeGraphQLServer = require("./servers/graphqlserver"); 
const {initializeHttpServer}=require("./servers/httpServer")
const app = express();
const mainServer = http.createServer(app);
const port = process.env.PORT || 3001;


connectToMongo();




app.use(cors());
app.use(express.json());


app.use("/app/users", require("./routes/students"));
app.use("/app/details", require("./routes/management"));
app.use("/app/teachers", require("./routes/teachers"));
app.use("/app/attendance", require("./routes/attendance"));
app.use("/app/onlineClass", require("./routes/onlineclass"));
app.use("/app/exam", require("./routes/onlineexam"));
app.use("/app/assignments", require("./routes/assignment"));

initializeHttpServer(app);

initializeGraphQLServer(app);


initializeWebSocket(mainServer);



mainServer.listen(port,'0.0.0.0', () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
