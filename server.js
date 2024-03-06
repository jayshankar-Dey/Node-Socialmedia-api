const express = require('express');
const cloudinary = require('cloudinary');
const colors = require('colors');
const morgan = require('morgan');
const cors = require('cors');
const cookie_parser = require('cookie-parser');
const connectDB = require('./db/db');
const Userouter = require('./routes/user.Route');
const Postrouter = require('./routes/post.Route');
const comentrouter = require('./routes/coment.Route');
const Likerouter = require('./routes/like.Route');
const followrouter = require('./routes/follow.router');
const app = express();
require('dotenv').config();

// middlewire configoraton
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(cookie_parser());

//db connection
connectDB();

// cloudinary configaration
cloudinary.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});


//first request///
app.get('/', (req, res) => {
    res.send("wellcome to blog_api");
})

//use route middleWire
app.use('/api/v1', Userouter)

//post route middlewire
app.use('/api/v1/post', Postrouter)

//Coment route middlewire
app.use('/api/v1/coment', comentrouter)

//post like and unlike
app.use('/api/v1/post', Likerouter)

//follow and unfollow 
app.use('/api/v1/user', followrouter)

app.listen(process.env.PORT, () => {
    console.log(`server is running on port http://localhost:${process.env.PORT}`.bgMagenta)
})