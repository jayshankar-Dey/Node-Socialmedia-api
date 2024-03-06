//follow controller
const Users = require('../models/user.model')
const followController = async(req, res) => {
        try {
            console.log(req.user._id)
            const { folloewId } = req.params;
            const user = await Users.findByIdAndUpdate(folloewId, {
                $addToSet: { followers: req.user._id }
            })
            const loginUser = await Users.findByIdAndUpdate(req.user._id, {
                $addToSet: { following: folloewId }
            })
            return res.status(200).json({
                success: true,
                messge: "follow succesfully",
                user,
                loginUser
            })
        } catch (error) {
            console.log(`error in follow controller ${error}`.bgred);
            if (error.name = "CastError") {
                return res.status(401).send({
                    success: false,
                    message: "Please enter a valide post id",
                });
            }
            return res.status(400).json({
                success: false,
                messge: "error in follow controller",
                error
            });
        }
    }
    //unfollow controller

const unfollowController = async(req, res) => {
    try {
        const { unfolloewId } = req.params;
        const user = await Users.findById(unfolloewId)
        user.followers.pull(req.user._id)

        const loginUser = await Users.findById(req.user._id)
        loginUser.following.pull(unfolloewId)
        await loginUser.save()

        await user.save()
        return res.status(200).json({
            success: true,
            messge: "unfollow succesfully",
            user,
            loginUser
        })
    } catch (error) {
        console.log(`error in unfollow controller ${error}`.bgred);
        if (error.name = "CastError") {
            return res.status(401).send({
                success: false,
                message: "Please enter a valide post id",
            });
        }
        return res.status(400).json({
            success: false,
            messge: "error in unfollow controller",
            error
        });
    }
}


module.exports = {
    followController,
    unfollowController
}