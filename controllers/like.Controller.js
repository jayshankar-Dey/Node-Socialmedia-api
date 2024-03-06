const Posts = require('../models/post.model');
//post like controller//////////
const likeController = async(req, res) => {
        try {
            const { id } = req.params;
            const post = await Posts.findByIdAndUpdate(id, {
                $addToSet: { like: req.user._id }
            })

            return res.status(200).json({
                success: true,
                message: "post like succesfully",
                post
            })
        } catch (error) {
            console.log(`error in like api ${error}`);
            if (error.name = "CastError") {
                return res.status(401).send({
                    success: false,
                    message: "Please enter a valide post id",
                });
            }
            return res.status(500).json({
                success: false,
                message: "error in  post like api"
            });
        }
    }
    ///post unlike controller
const UnlikeController = async(req, res) => {
    try {
        const { id } = req.params;
        const post = await Posts.findByIdAndUpdate(id, {
            $pull: { like: req.user._id }
        })

        return res.status(200).json({
            success: true,
            message: "post Unlike succesfully",
            post
        })
    } catch (error) {
        console.log(`error in like api ${error}`);
        if (error.name = "CastError") {
            return res.status(401).send({
                success: false,
                message: "Please enter a valide post id",
            });
        }
        return res.status(500).json({
            success: false,
            message: "error in  post Unlike api"
        });
    }
}
module.exports = {
    likeController,
    UnlikeController
}