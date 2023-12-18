const { default: mongoose } = require('mongoose');

const subjectSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

export const Subject = mongoose.model('Subject', subjectSchema);
