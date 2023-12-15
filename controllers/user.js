const User = require("../models/user.js");

async function index (req, res) {
    try {
        const user = await User.find({}).sort({createdAt: -1});
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({"error": err.message})
    }
}

async function show (req, res) {
    try {
        const id = req.params.id;
        const user = await User.findById(id);
        res.status(200).json(user);
    } catch (err) {
        res.status(404).json({"error": err.message})
    }
}


async function create (req, res) {              
    try {
        const { name , surname, email, password } = req.body
        const user = await User.create({name, surname, email, password});
        res.status(201).json(user);
    } catch (err) {
        res.status(404).json({"error": err.message})
    }
}


async function update (req, res) {
    try {
        const id = req.params.id;
        const { password } = req.body;
        const user = await User.findByIdAndUpdate(id, {
            password
        },{ new: true });
        res.status(200).json(user);
    } catch (err) {
        res.status(404).json({"error": err.message})
    }
}

async function destroy (req, res) {
    try {
        const id = req.params.id;
        const user = await User.findByIdAndDelete(id);
        res.sendStatus(204);
    } catch (err) {
        res.status(404).json({"error": err.message})
    }
}

module.exports = {
    index, show, update, create, destroy
}
