const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    bio: { type: String },
    profilePicture: { type: mongoose.Schema.Types.ObjectId, ref: 'Image' },
}, { timestamps: true });

module.exports = mongoose.model('Author', authorSchema);
