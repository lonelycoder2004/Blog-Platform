const mongoose = require('mongoose');
const registermodelSchema = new mongoose.Schema({
    role: {
        type: String,
        default:"user"
    },
    name: {
        type: String
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type:String
    },
});
module.exports = mongoose.model("registermodel", registermodelSchema);