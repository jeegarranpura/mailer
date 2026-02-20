require("dotenv").config();
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const bodyParser = require("body-parser");
const cors = require("cors");

app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);
app.use(bodyParser.json());
app.use(
  cors({
    origin: "*",
  }),
);
app.use("/api/v1/", require("./routes/mainRoutes"));

server.listen(8080, () => {
  console.log("server is started with love");
});
