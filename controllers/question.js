require('dotenv').config();
const { OpenAI } = require('openai');
const Question = require('../models/question');
const Note = require('../models/note');
const Subject = require('../models/subject');
const Answer = require('../models/answer');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const generateQuestions = async (subject, notes) => {
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: 'assistant',
        content: `You are an assistive revision tool for school students, where your task is to generate revision questions based on the provided topic and the revision notes of the student. 
        
        You should create a valid JSON object containing the revision questions and their related answers following this format:

        {
          "questions": [
            {
              "name": "Fill in question name",
              "answers": [
                {
                "text": "Fill in answer value",
                "isCorrect": false (true if it is the correct answer)
                },
                {
                "text": "Fill in answer value",
                "isCorrect": false (true if it is the correct answer)
                },
                {
                "text": "Fill in answer value",
                "isCorrect": false (true if it is the correct answer)
                },
                {
                "text: "Fill in answer value",
                "isCorrect": false (true if it is the correct answer)
                }
              ]
            }
          ]
        }

        There should only be four possible answers within a given question, with only one answer having the 'isCorrect' key set to 'true'. Feel free to generate an appropriate amount of questions depending on the length of the revision notes.

        The topic is: ${subject}
    
        The revision notes are as follows:
    
        ${notes.map((n) => `${n.content}\n`)}`
      }
    ],
    model: 'gpt-3.5-turbo-1106'
  });

  return completion.choices[0];
};

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

const create = async (req, res) => {
  try {
    const { subjectId } = req.body;

    const subject = await Subject.findById(subjectId);
    const notes = await Note.find({ subjectId: subjectId });

    if (!notes) {
      return res.status(400).json({
        error: 'You have no notes with the inputted subject'
      });
    }

    const { message } = await generateQuestions(subject.name, notes);
    console.log(message.content);

    const { questions } = JSON.parse(message.content);

    const filteredQuestions = questions.map((q) => {
      return {
        name: q.name,
        subjectId: subjectId
      };
    });

    const createdQuestions = await Question.create(filteredQuestions);

    const filteredAnswers = [];

    for (let i = 0; i < questions.length; i++) {
      for (let j = 0; j < questions[i].answers.length; j++) {
        filteredAnswers.push({
          text: questions[i].answers[j].text,
          isCorrect: questions[i].answers[j].isCorrect,
          questionId: createdQuestions[i]._id
        });
      }
    }

    const createdAnswers = await Answer.create(filteredAnswers);

    res
      .status(201)
      .json({ questions: createdQuestions, answers: createdAnswers });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const destroy = async (req, res) => {
  try {
    const { id } = req.params;
    res.status(200).json(await Question.findByIdAndDelete(id));
  } catch (e) {
    res.status(404).json({ error: e.message });
  }
};

module.exports = {
  index,
  create,
  destroy
};
