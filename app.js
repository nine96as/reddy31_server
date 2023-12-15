const express = require('express');
const cors = require('cors');
const morgan = require('morgan')

const userRouter = require('./routers/user');

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'))

app.get("/", (req, res) => {
  res.json({
    message: "welcome to the user databse",
  })
})

app.use("/users", userRouter);

module.exports = app;
