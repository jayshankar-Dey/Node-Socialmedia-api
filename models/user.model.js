const mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "user name is required"]
    },
    email: {
        type: String,
        required: [true, "email is required"]
    },
    password: {
        type: String,
        required: [true, "password is required"]
    },
    profile: {
        public_id: {
            type: String
        },
        url: {
            type: String
        }
    },
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    }]
}, { timestamps: true });

userSchema.pre('save', async function(next) {
    const user = this;
    if (!user.isModified('password')) {
        next();
    }
    const hashpassword = await bcrypt.hash(user.password, 10);
    user.password = hashpassword;
});
//// compaire password//

userSchema.methods.comparePassword = async function(plainPassword) {

    return await bcrypt.compare(plainPassword, this.password)
}

////jenerate token///
userSchema.methods.genarateToken = async function() {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET)
}

const Users = mongoose.model("Users", userSchema);
module.exports = Users;