const mongoose = require('mongoose');

const answerSchema = mongoose.Schema(
  {
    text: {
      type: String,
      required: true
    },
    isCorrect: {
      type: Boolean,
      default: 'false'
    },
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
      required: true
    }
  },
  { timestamps: true }
);

const Answer = mongoose.model('Answer', answerSchema);

module.exports = Answer;
