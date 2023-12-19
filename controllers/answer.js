const Answer = require('../models/answer')

//get by question

async function showByQuestion(req, res) {
    try {
      const questionId = req.params.questionId; 
  
      const answers = await Answer.find({ questionId });
  
      res.json(answers);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
}

//create

async function create(req, res) {
    try {
      const { text, isCorrect, questionId } = req.body;
  
      const newAnswer = new Answer({
        text,
        isCorrect: isCorrect || false, 
        questionId
      });
  
      const savedAnswer = await newAnswer.save();
  
      res.status(201).json(savedAnswer);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
}
  
module.exports = {
    create,
    showByQuestion
};
