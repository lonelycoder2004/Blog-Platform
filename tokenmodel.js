
const mongoose = require('mongoose');
const tokenmodelSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, // Reference to the user
        required: true,
    },
    token: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: '100h', // Automatically remove the token after 1 hour
    },
});
module.exports = mongoose.model("tokenmodel", tokenmodelSchema);