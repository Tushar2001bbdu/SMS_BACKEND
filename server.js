const connectToMongo = require("./config/db");
const express = require("express");
const http = require("http");
const cors = require("cors");

const { initializeHttpServer } = require("./servers/httpServer");
const { initializeWebSocket } = require("./servers/websocketServer");
const { ExpressPeerServer } = require('peer');
const awsServerlessExpress = require('aws-serverless-express');
const app = express();
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

const server = awsServerlessExpress.createServer(app);
const graphqlServer = require("./servers/graphqlserver")

const peerPort = 3002;
const peerServerInstance = http.createServer();
const peerServer = ExpressPeerServer(peerServerInstance, { debug: true, path: '/peerjs' });


app.use('/peerjs', peerServer);


initializeHttpServer(app);
initializeWebSocket(server);


const port = process.env.PORT || 3001;


graphqlServer();
peerServerInstance.listen(peerPort, () => {
  console.log(`PeerJS Server listening on port ${peerPort}`);
});

exports.handler = (event, context) => awsServerlessExpress.proxy(server, event, context);
