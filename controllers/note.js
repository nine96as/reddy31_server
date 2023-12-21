const User = require('../models/user');
const Token = require('../models/token');
const Note = require('../models/note');
const Subject = require('../models/subject');

const indexByUser = async (req, res) => {
  try {
    const userToken = req.headers['authorization'];
    const token = await Token.findOne({ token: userToken });

    const user = await User.findOne({ _id: token.userId });

    const notes = Note.find({ userId: user._id });

    res.status(200).json({
      count: notes.length,
      data: notes
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const create = async (req, res) => {
  try {
    const { title, content } = req.body;
    const userToken = req.headers['authorization'];
    const token = await Token.findOne({ token: userToken });

    if (!title || !content) {
      return res.status(400).json({
        error: 'You must send all required fields: title, author'
      });
    }

    const subject = (await Subject.find({}).sort({ _id: -1 }).limit(1))[0];

    const note = await Note.create({
      title: title,
      content: content,
      userId: token.userId,
      subjectId: subject._id
    });

    res.status(201).send(note);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const show = async (req, res) => {
  try {
    const { id } = req.params;
    res.status(200).json(await Note.findById(id));
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    const userToken = req.headers['authorization'];
    const token = await Token.findOne({ token: userToken });

    const user = await User.findOne({ _id: token.userId });
    const note = await Note.findById(id);

    if (note.userId === user._id) {
      if (!title && !content)
        return res.status(400).json({
          error: 'You must specify one of: title, content'
        });

      res
        .status(200)
        .json(await Note.findByIdAndUpdate(id, req.body, { new: true }));
    } else {
      res.status(403).json({
        error: 'You must be the note creator to update the note!'
      });
    }
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

const destroy = async (req, res) => {
  try {
    const { id } = req.params;
    const userToken = req.headers['authorization'];
    const token = await Token.findOne({ token: userToken });
    const user = await User.findOne({ _id: token.userId });
    const note = await Note.findById(id);

    if (note.userId.equals(user._id)) {
      res.status(200).json(await Note.findByIdAndDelete(id));
    } else {
      res.status(403).json({
        error: 'You must be the note creator to delete the note!'
      });
    }
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

module.exports = {
  indexByUser,
  create,
  show,
  update,
  destroy
};
