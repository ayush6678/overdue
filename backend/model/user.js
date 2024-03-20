const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    amount: { type: Number, required: true },
    email: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

module.exports = User;