const express = require('express');
const router = express.Router();
const isauth = require('../middlewire/auth.Middlewire');
const { likeController, UnlikeController } = require('../controllers/like.Controller');

router.put('/like/:id', isauth, likeController)
router.put('/unlike/:id', isauth, UnlikeController)

///export part
module.exports = router;