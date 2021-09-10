const expressEdge = require("express-edge");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const http = require('http');
require('dotenv').config();

const createPostController = require('./controllers/createPost');
const homePageController = require('./controllers/homePage');
const storePostController = require('./controllers/storePost');
const getPostController = require('./controllers/getPost');
const createUserController = require("./controllers/createUser");
const storeUserController = require('./controllers/storeUser');

const app = new express();
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST","PUT","DELETE","HEAD","PATCH"],
    allowedHeaders: ["Origin, X-Requested-With, Content-Type, Accept, Authorization, X-CSRF-Token, User-Agent"],
    credentials: true,
  }
});

mongoose.connect(process.env.MongoDB, { useNewUrlParser: true })
    .then(() => 'You are now connected to Mongo!')
    .catch(err => console.error('Something went wrong', err));

app.use(express.static("public"));
app.use(expressEdge.engine);
app.set('views', __dirname + '/views');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



app.get("/", homePageController);
app.get("/post/:id", getPostController);
app.get("/posts/new", createPostController);
app.post("/posts/store", storePostController);
app.get("/auth/register", createUserController);
app.post("/users/register", storeUserController);

io.on('connection', (socket) => {
  console.log("a user connected")
  socket.on('new post', msg => {
    io.emit('new post', msg);
  });
});

server.listen(4000, () => {
  console.log("App listening on port 4000");
});
