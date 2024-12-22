const express = require('express');
const router = express.Router();
const Post = require('../models/Post');



router.post('/posts', async (req, res) => {
    try {
        const { title, postBody, category, image, author, } = req.body;

        console.log("resquest params", title, postBody, image, author, )

        const savedPost = await Post.create({ title: title, postBody: postBody, category: category, image: image, author: author })

        console.log("savedPost", savedPost)

        res.status(201).json({
            message: 'Post saved successfully!',
            post: savedPost
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error saving post', error });
    }
});


// Route to get all posts with pagination
router.get('/posts', async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query; // Defaults: page 1, limit 10 posts
        const pageNumber = parseInt(page);
        const limitNumber = parseInt(limit);
        const skip = (pageNumber - 1) * limitNumber;

        // Fetch posts with pagination
        const posts = await Post.find().skip(skip).limit(limitNumber).populate('category');

        // Count total documents
        const totalPosts = await Post.countDocuments();
        const totalPages = Math.ceil(totalPosts / limitNumber);

        res.status(200).json({
            message: 'Posts retrieved successfully!',
            posts,
            pagination: {
                totalPosts,
                totalPages,
                currentPage: pageNumber,
                postsPerPage: limitNumber,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving posts', error });
    }
});

router.get('/posts/:id', async (req, res) => {
    try {
        const postId = req.params.id; // Get the ID from the URL parameter

        // Fetch the post by ID
        const post = await Post.findOne({ _id: postId }).populate('category')

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Send the response with the post
        res.status(200).json({
            message: 'Post retrieved successfully!',
            post: post
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving post', error });
    }
});

router.put('/posts/:id', async (req, res) => {
    try {
        const postId = req.params.id;
        const { title, postBody, author, image } = req.body;

        // Find the post by ID and update it
        const updatedPost = await Post.findByIdAndUpdate(
            postId,
            { title, postBody, author, image },
            { new: true, runValidators: true } // Return the updated post and validate input
        );

        if (!updatedPost) {
            return res.status(404).json({ message: 'Post not found' });
        }

        res.status(200).json({
            message: 'Post updated successfully!',
            post: updatedPost
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating post', error });
    }
});

router.delete('/posts/:id', async (req, res) => {
    try {
        const postId = req.params.id; // Get the ID from the URL parameter

        const deletedPost = await Post.findByIdAndDelete(postId);

        if (!deletedPost) {
            return res.status(404).json({ message: 'Post not found' });
        }

        res.status(200).json({
            message: 'Post deleted successfully!',
            post: deletedPost
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting post', error });
    }
});





module.exports = router;