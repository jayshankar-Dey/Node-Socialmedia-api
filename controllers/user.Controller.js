const Users = require("../models/user.model");
const getFile = require("../config/getdataURI");
const cloudinary = require("cloudinary");
const { Promise } = require("mongoose");

const createUsersController = async(req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).send({
                success: false,
                message: "please provide all fields",
            });
        }
        if (await Users.findOne({ email: email })) {
            return res.status(400).send({
                success: false,
                message: "User alrady register",
            });
        }
        const user = await Users.create({ name, email, password });
        return res.status(200).send({
            success: true,
            message: "User register Successfully",
            user,
        });
    } catch (error) {
        console.log(`error in get user api ${error}`.bgRed);
    }
};

//loginController/////////////////

const loginUserController = async(req, res) => {
    try {
        const { email, planPassword } = req.body;
        if (!email || !planPassword) {
            return res.status(400).send({
                success: false,
                message: "please provide all fields",
            });
        }
        //find user
        const user = await Users.findOne({ email: email });
        if (user) {
            //compair user
            const compare = await user.comparePassword(planPassword);
            if (compare) {
                const token = await user.genarateToken();
                return res
                    .status(200)
                    .cookie("token", token, {
                        expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
                        httpOnly: true,
                        secure: true,
                    })
                    .send({
                        success: true,
                        message: "User login Successfully",
                        token,
                    });
            } else {
                return res.status(401).send({
                    success: false,
                    message: "User not found",
                });
            }
        } else {
            return res.status(401).send({
                success: false,
                message: "User not found",
            });
        }
    } catch (error) {
        console.log(`error in get user api ${error}`.bgRed);
    }
};
///user logout controller//////////

const logoutUserController = async(req, res) => {
    try {
        return res
            .status(200)
            .cookie("token", "", {
                expires: new Date(Date.now()),
                httpOnly: true,
                secure: true,
            })
            .send({
                success: true,
                message: "User Logout Successfully",
            });
    } catch (error) {
        console.log(`error in get user api ${error}`.bgRed);
    }
};

/// get single user and all users api/////////////////
const getSingleUserController = async(req, res) => {
    try {
        const { id } = req.params;
        console.log(req.user._id)
        if (!id) {
            // const user = await Users.find({
            //     _id: {
            //         $ne: req.user._id
            //     }
            // }).populate({
            //     path: "followers",
            //     select: "profile name _id"
            // }).populate({
            //     path: "following",
            //     select: "profile name _id"
            // });
            const user = await Users.findById({ _id: req.user._id })
            let id = []
            user.following.forEach((user, i) => {
                id.push(user)
            })

            const all = await Users.find({
                $and: [
                    { _id: { $ne: id } },
                    { _id: { $ne: req.user._id } }
                ]
            }).populate({
                path: "followers",
                select: "profile name _id"
            }).populate({
                path: "following",
                select: "profile name _id"
            });

            console.log(all)
                ///login user
            const loginuser = await Users.findById(req.user._id)
                .populate({
                    path: "followers",
                    select: "profile name _id",
                })
                .populate({
                    path: "following",
                    select: "profile name _id",
                });

            return res.status(200).json({
                success: true,
                message: "all users  fetch succesfully",
                all,
                loginuser,
            });
        }

        const user = await Users.findById(id)
            .populate({
                path: "followers",
                select: "profile name _id",
            })
            .populate({
                path: "following",
                select: "profile name _id",
            });
        return res.status(200).json({
            success: true,
            message: "get singleuser Successfully",
            user,
        });
    } catch (error) {
        console.log(`error in get user api ${error}`.bgRed);
        if ((error.name = "CastError")) {
            return res.status(401).send({
                success: false,
                message: "Please enter a valide user id",
            });
        }
        return res.status(401).send({
            success: false,
            message: "User fetch failed",
            error,
        });
    }
};
///search  user controller
const SearchController = async(req, res) => {
    try {
        const { search } = req.params;
        const user = search ? {
            name: {
                $regex: search,
                $options: "i",
            },
        } : {
            _id: { $ne: req.user._id },
        };

        const searchUser = await Users.find(user);

        return res.status(200).json({
            success: true,
            message: "search Successfully",
            searchUser,
        });
    } catch (error) {
        console.log(`error in get user api ${error}`.bgRed);
        return res.status(401).send({
            success: false,
            message: "User fetch failed",
            error,
        });
    }
};
//get user profile controller
const getUserProfileController = async(req, res) => {
    try {
        const profile = await Users.findById(req.user._id)
            .populate({
                path: "followers",
                select: "profile name _id",
            })
            .populate({
                path: "following",
                select: "profile name _id",
            });

        return res.status(200).json({
            success: true,
            message: "profile fetch Successfully",
            profile,
        });
    } catch (error) {
        console.log(`error in get user profile api ${error}`.bgRed);
        if ((error.name = "CastError")) {
            return res.status(401).send({
                success: false,
                message: "Please enter a valide user id",
            });
        }
        return res.status(401).send({
            success: false,
            message: "User profile fetch failed",
            error,
        });
    }
};
//update profie controller
const updateProfilecontroller = async(req, res) => {
    try {
        const user = await Users.findById(req.user._id);
        if (user) {
            // console.log(req.file)
            const file = getFile(req.file);
            await cloudinary.v2.uploader.destroy(user.profile.public_id);
            const cdb = await cloudinary.v2.uploader.upload(file.content);
            user.profile = {
                public_id: cdb.public_id,
                url: cdb.secure_url,
            };
            await user.save();
        }
        return res.status(200).json({
            success: true,
            message: "user profile update succesfully",
            user,
        });
    } catch (error) {
        console.log(`error in update profile api ${error}`.bgRed);
        return res.status(401).send({
            success: false,
            message: "Profile update failed",
            error,
        });
    }
};
//update user controller
const updateUserController = async(req, res) => {
    try {
        const { name, email } = req.body;
        const user = await Users.findById(req.user._id);
        if (user) {
            // console.log(req.file)
            if (name) user.name = name;
            if (email) user.email = email;
            await user.save();
        }
        return res.status(200).json({
            success: true,
            message: "user profile update succesfully",
            user,
        });
    } catch (error) {
        console.log(`error in update user api ${error}`.bgRed);
        return res.status(401).send({
            success: false,
            message: "user update failed",
            error,
        });
    }
};
//user password update controller

const updatePasswordController = async(req, res) => {
    try {
        const { oldpassword, newpassword } = req.body;
        // validation
        if (!oldpassword)
            return res.status(400).send({ message: "please enter old password" });
        if (!newpassword)
            return res.status(400).send({ message: "please enter new password" });

        const user = await Users.findById(req.user._id);
        if (user) {
            const varify = user.comparePassword(oldpassword);
            if (varify) {
                user.password = newpassword;
                await user.save();
            }
        }
        return res.status(200).json({
            success: true,
            message: "user password update succesfully",
            user,
        });
    } catch (error) {
        console.log(`error in update password api ${error}`.bgRed);
        return res.status(401).send({
            success: false,
            message: "password update failed",
            error,
        });
    }
};
module.exports = {
    createUsersController,
    getSingleUserController,
    loginUserController,
    logoutUserController,
    updateProfilecontroller,
    updateUserController,
    updatePasswordController,
    SearchController,
    getUserProfileController,
};