const express = require('express');
const {
    createUsersController,
    getSingleUserController,
    loginUserController,
    logoutUserController,
    updateProfilecontroller,
    updateUserController,
    updatePasswordController,
    SearchController,
    getUserProfileController
} = require('../controllers/user.Controller');
const singleUplode = require('../config/multer');
const isauth = require('../middlewire/auth.Middlewire');
const router = express.Router();

//user routes////
router.post('/user/register', createUsersController)
router.post('/user/login', loginUserController)
router.get('/Logout', isauth, logoutUserController)
router.get('/user/:id?', isauth, getSingleUserController)
router.get('/:search?', isauth, SearchController)
router.get('/profile/user', isauth, getUserProfileController)

//update profile//////
router.put('/update/profile', isauth, singleUplode, updateProfilecontroller)
router.put('/update/user', isauth, updateUserController)
router.post('/update/password', isauth, updatePasswordController)
module.exports = router;