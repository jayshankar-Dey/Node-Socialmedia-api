const getFile = require("../config/getdataURI");
const cloudinary = require("cloudinary");
const Posts = require("../models/post.model");

//create post controller///
const createPostController = async(req, res) => {
    try {
        const { title, des } = req.body;
        //validation
        if (!title) return res.status(400).json({ message: "please enter title" });
        if (!des)
            return res.status(400).json({ message: "please enter descretion" });
        if (!req.file)
            return res.status(400).json({ message: "please uplode image" });

        //file uplode
        const file = getFile(req.file);
        const cdb = await cloudinary.v2.uploader.upload(file.content);
        const post = await Posts.create({
            title,
            des,
            image: { public_id: cdb.public_id, url: cdb.secure_url },
            user: req.user._id,
        });
        return res.status(200).json({
            success: true,
            message: "Post uplode succesfully",
            post,
        });
    } catch (error) {
        console.log(`error in create post api${error}`);
        return res.status(500).json({
            success: false,
            message: "error in create post api",
        });
    }
};
//get all blog controller

const getallblogController = async(req, res) => {
    try {
        console.log(req.user._id);
        const post = await Posts.find({
                user: req.user._id,
            })
            .populate({
                path: "user",
                select: "profile name",
            })
            .populate({
                path: "coment",
                select: "coment user",
                populate: {
                    path: "user",
                    select: "profile name",
                },
            })
            .populate({
                path: "like",
                select: "profile name",
            });

        return res.status(200).json({
            success: true,
            message: "fetch user blog succesfully",
            post,
        });
    } catch (error) {
        console.log(`error in get post api${error}`);
        return res.status(500).json({
            success: false,
            message: "error in get all blog api",
        });
    }
};

//delete single post api
const deleteSinglePostController = async(req, res) => {
    try {
        const { id } = req.params;
        const post = await Posts.findById(id);
        if ((post.user = req.user._id)) {
            await cloudinary.v2.uploader.destroy(post.image.public_id);
            await post.deleteOne();
            const totalPost = await Posts.find({
                user: req.user._id,
            }).countDocuments();
            return res.status(200).json({
                success: true,
                message: "Post delete succesfully",
                totalPost,
            });
        } else {
            return res.status(500).json({
                success: false,
                message: "cannot  delete post ",
            });
        }
    } catch (error) {
        console.log(`error in delete post api${error}`);
        if ((error.name = "CastError")) {
            return res.status(401).send({
                success: false,
                message: "Please enter a valide post id",
            });
        }
        return res.status(500).json({
            success: false,
            message: "error in delete post api",
        });
    }
};
//update single post api
const UpdateSinglePostController = async(req, res) => {
    try {
        const { title, des } = req.body;
        const { id } = req.params;
        const post = await Posts.findById(id);
        if ((post.user = req.user._id)) {
            if (title) post.title = title;
            if (des) post.des = des;
            if (req.file) {
                const file = getFile(req.file);
                await cloudinary.v2.uploader.destroy(post.image.public_id);
                const cdb = await cloudinary.v2.uploader.upload(file.content);
                post.image = {
                    public_id: cdb.public_id,
                    url: cdb.secure_url,
                };
                await post.save();
            }
            return res.status(200).json({
                success: true,
                message: "Post update succesfully",
                post,
            });
        } else {
            return res.status(500).json({
                success: false,
                message: "cannot  update post ",
            });
        }
    } catch (error) {
        console.log(`error in update post api${error}`);
        if ((error.name = "CastError")) {
            return res.status(401).send({
                success: false,
                message: "Please enter a valide post id",
            });
        }
        return res.status(500).json({
            success: false,
            message: "error in update post api",
        });
    }
};

module.exports = {
    createPostController,
    deleteSinglePostController,
    UpdateSinglePostController,
    getallblogController,
};