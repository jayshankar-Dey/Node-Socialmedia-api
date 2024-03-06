const express = require('express');
const router = express.Router();
const singleUplode = require('../config/multer');
const isauth = require('../middlewire/auth.Middlewire');
const {
    createPostController,
    deleteSinglePostController,
    UpdateSinglePostController,
    getallblogController
} = require('../controllers/post.Controller');

///create post route
router.post('/create', isauth, singleUplode, createPostController)
    //get all post
router.get('/blog', isauth, getallblogController)
    //delete single post
router.delete('/delete/:id', isauth, deleteSinglePostController)
    //update single post
router.put('/update/:id', isauth, singleUplode, UpdateSinglePostController)

///
module.exports = router