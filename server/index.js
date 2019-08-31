require('dotenv').config();
const express = require("express");
const app = express();
const port = 7000;
const cors = require("cors");

app.use(
  cors({
    origin: process.env.APP_URL,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true
  })
);

app.get("/", (req, res) => {
  res.status(200).json({
    message: "user successfully authenticated",
    user: "alan"
  });
});

app.listen(port, () => console.log(`Server is running on port ${port}!`));