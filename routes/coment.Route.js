const express = require('express');
const { addComentController, deleteComentController, UpdateComentController } = require('../controllers/coment.Controller');
const router = express.Router()
const isauth = require('../middlewire/auth.Middlewire');

router.put('/add/:id', isauth, addComentController)
router.delete('/delete/:id', isauth, deleteComentController)
router.put('/update/:id', isauth, UpdateComentController)

//export//
module.exports = router;