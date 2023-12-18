const mongoose = require('mongoose');

const questionSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: true
    }
  },
  { timestamps: true }
);

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
