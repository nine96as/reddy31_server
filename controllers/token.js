const Token = require('../models/token');

async function index(req, res) {
    try {
        const tokens = await Token.find();
        res.json(tokens);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function destroy(req, res) {
    try {
        const tokenValue = req.params.token;
        const tokenToRemove = await Token.findOne({ token: tokenValue });
        if (!tokenToRemove) {
            return res.status(404).json({ error: 'Token not found' });
        }
        await tokenToRemove.remove();
        res.status(204).end();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = {
    index,
    destroy
};

