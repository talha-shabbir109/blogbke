const express = require('express');
const router = express.Router();
const Category = require('../models/Category');


router.post('/categories', async (req, res) => {
    try {
        const { name, description } = req.body;

        console.log("Request Params:", name, description);

        const newCategory = await Category.create({ name, description });

        console.log("Saved Category:", newCategory);

        res.status(201).json({
            message: 'Category created successfully!',
            category: newCategory
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating category', error });
    }
});


router.get('/categories', async (req, res) => {
    try {
        const categories = await Category.find();

        res.status(200).json({
            message: 'Categories retrieved successfully!',
            categories
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving categories', error });
    }
});


router.get('/categories/:id', async (req, res) => {
    try {
        const categoryId = req.params.id;

        const category = await Category.findById(categoryId);

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.status(200).json({
            message: 'Category retrieved successfully!',
            category
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving category', error });
    }
});


router.put('/categories/:id', async (req, res) => {
    try {
        const categoryId = req.params.id;
        const { name, description } = req.body;

        const updatedCategory = await Category.findByIdAndUpdate(
            categoryId,
            { name, description },
            // { new: true, runValidators: true }
        );

        if (!updatedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.status(200).json({
            message: 'Category updated successfully!',
            category: updatedCategory
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating category', error });
    }
});


router.delete('/categories/:id', async (req, res) => {
    try {
        const categoryId = req.params.id;

        const deletedCategory = await Category.findByIdAndDelete(categoryId);

        if (!deletedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.status(200).json({
            message: 'Category deleted successfully!',
            category: deletedCategory
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting category', error });
    }
});

module.exports = router;
