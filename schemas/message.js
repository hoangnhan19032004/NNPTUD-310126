const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    messageContent: {
        type: {
            type: String,
            enum: ["file", "text"]
        },
        text: String
    }
}, { timestamps: true });

module.exports = mongoose.model("messages", messageSchema);