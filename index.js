var admin = require("firebase-admin");
var serviceAccount = require("./service.json");
const google = require('googleapis');
const keys = require('./service.json');
const cors = require('cors');
const express = require('express');

process.env.GOOGLE_APPLICATION_CREDENTIALS;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: "*",
  })
);

app.use(
  cors({
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
  })
);

app.use(function (req, res, next) {
  res.setHeader("Content-Type", "application/json");
  next();
});

app.get("/", function (req, res) {
  var token;
  new Promise(function (resolve, reject) {
    const key = require('./service.json');
    const jwtClient = new google.Auth.JWT(
      key.client_email,
      null,
      key.private_key,
      ["https://www.googleapis.com/auth/firebase.messaging"],
      null
    );
    jwtClient.authorize(function (err, tokens) {
      if (err) {
        reject(err);
        return;
      }
      resolve(tokens.access_token);
      token = tokens.access_token
      console.log(tokens.access_token);
    });
  }).then((response) => {
    res.status(200).json({
      access_token: token,
    });
    console.log("Successfully sent :", response);
  })
    .catch((error) => {
      res.status(400);
      res.send(error);
      console.log("Error sending :", error);
    });

});


app.listen(3000, function () {
  console.log("Server started on port 3000");
});