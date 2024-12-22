const mongoose = require('mongoose'); // Import mongoose

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    postBody: {
        type: String,
        required: true,
    },
    // bannerImage: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Image',
    // },
    // author: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Author',
    // },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
    },

    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Author',
    },
    image:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Image',
    }
}, { timestamps: true });

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
