const express = require('express');
const Users = require('../models/user.model')
const isauth = require('../middlewire/auth.Middlewire');
const {
    followController,
    unfollowController
} = require('../controllers/follow.Controller');
const router = express.Router();

router.put('/follow/:folloewId', isauth, followController)
router.put('/unfollow/:unfolloewId', isauth, unfollowController)


module.exports = router;