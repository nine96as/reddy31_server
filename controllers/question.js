const Question = require('../models/question');

const index = async (req, res) => {
  try {
    const questions = await Question.find({});
    res.status(200).json({
      count: questions.length,
      data: questions
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  index
};
