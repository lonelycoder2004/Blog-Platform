const express = require('express');
const app = express();
const blogmodel = require('../models/blogmodel');


app.post('/blog/add', async (req, res) => {
    try {
        const { date,authorname,name, longdescription, category,uniquename} = req.body;

        // Validate required fields

        // Create a new blog entry
        var blogEntry = new blogmodel({
            date:date,
            authorname:authorname,
            name:name,
            longdescription:longdescription,
            category:category,
            uniquename:uniquename
        });

        // Save the blog entry to the database
        await blogEntry.save();

        res.status(200).json({
            status: true,
            msg: "Blog entry added successfully",
            user: blogEntry,
        });
    } catch (err) {
        console.error("Error saving blog entry:", err);
        res.status(500).json({
            status: false,
            msg: "Failed to add blog entry",
        });
    }
});

app.put('/blog/update/:id', async (req, res) => {
    try {
        const { id } = req.params;  // Get ID from URL parameter
        const { longdescription } = req.body; // Get the new long description from request body

        // Check if both id and longdescription are provided
        if (!id || !longdescription) {
            return res.status(400).json({
                status: false,
                msg: 'ID and long description are required for update'
            });
        }

        // Find and update the blog post by ID
        const updatedBlog = await blogmodel.findByIdAndUpdate(
            id,
            { longdescription: longdescription },
            { new: true } // Return the updated document
        );

        // Check if the blog post was found and updated
        if (!updatedBlog) {
            return res.status(404).json({
                status: false,
                msg: 'Blog post not found'
            });
        }

        res.status(200).json({
            status: true,
            msg: 'Blog post updated successfully',
            updatedBlog: updatedBlog
        });
    } catch (err) {
        res.status(500).json({
            status: false,
            msg: 'Update failed',
            error: err.message
        });
    }
});

app.get('/blog/view', async (req, res) => {
    try {
        const blogs = await blogmodel.find({}); // Retrieve all blogs

        if (!blogs.length) {
            res.status(200).json({
                status: false,
                msg: 'No blogs found'
            });
            return;
        }

        res.status(200).json({
            status: true,
            msg: 'Blogs retrieved successfully',
            content: blogs
        });
    } catch (err) {
        res.status(500).json({
            status: false,
            msg: 'Failed to retrieve blogs',
            error: err.message
        });
    }
});

app.get('/blog/singleview1/:id', async (req, res) => {
    try {
        const { id } = req.params;  // Get ID from URL parameter

        // Find the blog post by ID
        const blog = await blogmodel.findById(id);

        if (!blog) {
            return res.status(404).json({
                status: false,
                msg: 'Blog post not found'
            });
        }

        res.status(200).json({
            status: true,
            content: blog
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            msg: 'Error retrieving blog post',
            error: error.message
        });
    }
});

app.get('/blog/singleview', async (req, res) => {
    try {
        const { uniquename } = req.query; // Change this line

        const blogs = await blogmodel.find({ uniquename: uniquename });

        if (!blogs.length) {
            return res.status(200).json({
                status: false,
                msg: 'No blogs found'
            });
        }

        res.status(200).json({
            status: true,
            msg: 'Blogs retrieved successfully',
            content: blogs
        });

    } catch (err) {
        res.status(500).json({
            status: false,
            msg: 'Failed to retrieve blogs',
            error: err.message
        });
    }
});


app.post('/blog/delete', async (req, res) => {
    try {
        const blogId = req.body.id; // Get the blog's _id from the URL

        const deletedBlog = await blogmodel.findByIdAndDelete(blogId);

        if (!deletedBlog) {
            res.status(404).json({
                status: false,
                msg: 'Blog post not found'
            });
            return;
        }

        res.status(200).json({
            status: true,
            msg: 'Blog post deleted successfully',
            deletedBlog: deletedBlog
        });
    } catch (err) {
        res.status(500).json({
            status: false,
            msg: 'Failed to delete blog post',
            error: err.message // Include error details for easier debugging
        });
    }
});

module.exports = app;
