const mongoose = require("mongoose");
const { Schema } = mongoose;

const notesSchema =  new Schema({
    // kis user ke notes store ho rhe hai
    user: {
        // kind of foreign key & ref is reference model
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
        },
    title: {
        type: String,
        required: true
        },
    description: {
        type: String,
        required: true
        },
    tag: {
        type: String,
        default: "General"
        },
    date: {
        type: Date,
        default: Date.now
        }
});

module.exports = mongoose.model("notes", notesSchema);