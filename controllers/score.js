const Score = require('../models/score');
const Token = require('../models/token');
const Subject = require('../models/subject');

//index
async function index(req, res) {
  try {
    const scores = await Score.find();
    res.json({
      count: scores.length,
      data: scores
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

//show
async function show(req, res) {
  try {
    const token = req.params.token;
    const { userId } = await Token.findOne({ token: token });
    const score = await Score.findOne({ userId: userId });
    res.json(score);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

//filter by subject
async function showBySubject(req, res) {
  try {
    const subject = req.params.subject;
    const { _id } = await Subject.findOne({ name: subject });
    const score = await Score.findOne({ subjectId: _id });
    res.json(score);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

//create
async function create(req, res) {
  try {
    const { value, subjectId } = req.body;
    const userToken = req.headers['authorization'];

    const { userId } = await Token.findOne({ token: userToken });
    const { name } = await Subject.findOne({ _id: subjectId });

    const score = await Score.create({
      value,
      userId,
      subjectId,
      subjectName: name
    });

    res.status(201).json(score);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

//update

async function update(req, res) {
  try {
    const token = req.params.token;
    const { userId } = await Token.findOne({ token: token });
    const { value } = req.body;

    let score = await Score.findOne({ userId: userId });

    if (!score) {
      return res
        .status(404)
        .json({ error: 'this user doesnt have a score yet' });
    }

    score.value = value || score.value;

    const updatedScore = await score.save();

    res.json(updatedScore);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  index,
  show,
  showBySubject,
  create,
  update
};
