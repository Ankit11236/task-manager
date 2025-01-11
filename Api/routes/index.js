const express = require("express");
const app = express();
const authenticate = require("../middleware/auth");
const userAuth = require("./userAuth");
const tasks = require('./tasks')
const users = require('./users')


app.use("/auth", userAuth);
app.use(authenticate);


app.use("/users", users);
app.use('/tasks', tasks)

module.exports = app;
