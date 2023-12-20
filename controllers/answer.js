const Answer = require('../models/answer');

//get by question

async function showByQuestion(req, res) {
  try {
    const questionId = req.params.questionId;

    const answers = await Answer.find({ questionId });

    res.status(200).json(answers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

//create

async function create(req, res) {
  try {
    const { text, isCorrect, questionId } = req.body;

    const answer = await Answer.create({
      text,
      isCorrect: isCorrect || false,
      questionId
    });

    res.status(201).json(answer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  create,
  showByQuestion
};
