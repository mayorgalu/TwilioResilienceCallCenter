const express = require("express");
const twilio = require("./Twilio");
const bodyParser = require("body-parser");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");
const jwt = require("./utils/Jwt");
const { getAccessTokenForVoice } = require("./Twilio");
const { Twilio } = require("twilio");
const app = express();
const server = http.createServer(app);
const io = socketIo(server); //subscribe to events on this socket

io.use((socket, next) => {
  console.log("Socket middleware");
  if (socket.handshake.query && socket.handshake.query.token) {
    const { token } = socket.handshake.query;
    try {
      const result = jwt.verifyToken(token);
      if (result.username) return next();
    } catch (error) {
      console.log(error);
    }
  }
});
io.on("connection", (socket) => {
  //when we got a connection, this socket is a direct connection to a unique page on the browser
  console.log("Socket connected", socket.id);
  socket.emit("twilio-token", {
    token: getAccessTokenForVoice("ResiliencyConnection"),
  });
  socket.on("disconnect", () => {
    console.log("Socket disconnected", socket.id); //chapter 18
  });
  socket.on("answer-call", ({ sid }) => {
    console.log("Answering call with sid", sid);
    twilio.answerCall(sid);
  });
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

const PORT = 3001;
app.get("/test", (req, res) => {
  res.send("Welcome to the Resiliency Connection");
});

app.post("/check-token", (req, res) => {
  const { token } = req.body;
  let isValid = false;
  try {
    isValid = jwt.verifyToken(token);
  } catch (error) {
    console.log(error);
  }
  res.send({ isValid });
});

app.post("/login", async (req, res) => {
  console.log("logging in");
  const { to, username, channel } = req.body;
  const data = await twilio.SendVerifyAsync(to, channel);
  res.send("Sent Code");
});

app.post("/verify", async (req, res) => {
  console.log("Verifying code");
  const { to, code, username } = req.body;
  const data = await twilio.verifyCodeAsync(to, code);
  if (data.status === "approved") {
    const token = jwt.createJWT(username); //this username is tied to the JWT token, you can return a response here with the Jtoke
    return res.send({ token }); //the token here is an object returned so it can remain in the front end
  }

  res.status(401).send("Invalid token"); //chapter 21
});
app.post("/call-new", (req, res) => {
  //Chapter 30
  console.log("receive a new call");
  io.emit("call-new", { data: req.body });
  const response = twilio.voiceResponse(
    "Thank you for calling! You will be on a brief hold until the next agent becomes available."
  );
  res.type("text/xml");
  res.send(response.toString());
});

app.post("/call-status-changed", (req, res) => {
  console.log("Call status changes");
  res.send("ok");
});

app.post("/enqueue", (req, res) => {
  const response = twilio.enqueueCall("Customer Service");
  console.log("Enqueuing call");
  io.emit("enqueue", { data: req.body });
  res.type("text/xml");
  res.send(response.toString());
});

app.post("/connect-call", (req, res) => {
  console.log("Connecting call");
  const response = twilio.redirectCall("ResiliencyConnection");
  res.type("text/xml");
  res.send(response.toString());
});

server.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT}`);
});
