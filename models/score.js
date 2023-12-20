const mongoose = require('mongoose');

const scoreSchema = mongoose.Schema(
  {
    value: {
      type: String,
      required: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: true
    },
    subjectName: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: true
    }
  },
  { timestamps: true }
);

const Score = mongoose.model('Score', scoreSchema);

module.exports = Score;
