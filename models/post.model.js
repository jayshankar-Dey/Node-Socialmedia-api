const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "title is required"]
    },
    des: {
        type: String,
        required: [true, "description is required"]
    },
    image: {
        public_id: String,
        url: String
    },
    coment: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Coments"
    }],
    like: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    }],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    }

}, { timestamps: true })

const Posts = mongoose.model("Posts", postSchema);
module.exports = Posts;