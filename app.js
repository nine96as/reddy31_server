const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const userRouter = require('./routers/user');
const scoreRouter = require('./routers/score');
const subjectRouter = require("./routers/subject")

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'QuizWiz API'
  });
});

app.use('/users', userRouter);
app.use('/scores', scoreRouter);
app.use('/subjects', subjectRouter)

module.exports = app;
