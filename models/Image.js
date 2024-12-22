const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true,
    },
    fileName: {
        type: String,
        required: true,
    },
}, { timestamps: true });

const Image = mongoose.model('Image', imageSchema);

module.exports = Image;
