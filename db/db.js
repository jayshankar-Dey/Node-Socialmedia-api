const mongoose = require('mongoose');

const connectDB = async() => {
    mongoose.connect(process.env.MONGO_URI).then(() => {
        console.log('database connection succesfully'.bgGreen)
    }).catch((err) => {
        console.error(`error in mogo connection ${err}`)
    })
}

module.exports = connectDB;