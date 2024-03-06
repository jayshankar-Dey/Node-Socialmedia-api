const mongoose = require('mongoose');

const comentSchema = new mongoose.Schema({
    coment: {
        type: String
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    }
}, { timestamps: true })

const Coments = mongoose.model("Coments", comentSchema);
module.exports = Coments;