const Coments = require('../models/coment.model');
const Posts = require('../models/post.model');

const addComentController = async(req, res) => {
        try {
            const { coment } = req.body;
            const { id } = req.params;
            const post = await Posts.findById(id)
            if (coment) {
                const coments = await Coments.create({ coment, user: req.user._id })
                if (post.coment.includes(coments._id)) return res.status(200).json({ message: "coment alrady add" });
                post.coment.push(coments._id);
                await post.save();
                return res.status(200).json({
                    success: true,
                    message: "coment add succesfully",
                    post,
                    coments
                })
            }
        } catch (error) {
            console.log(`error in add coment controller api ${error}`);
            if (error.name = "CastError") {
                return res.status(401).send({
                    success: false,
                    message: "Please enter a valide post id",
                });
            }
            return res.status(400).json({
                success: false,
                message: "error in add coment controller api",
                error
            });
        }

    }
    //delete coment controller
const deleteComentController = async(req, res) => {
        try {
            const { id } = req.params;
            const { cid } = req.body;
            console.log(cid)
            await Posts.findOne({ _id: id }).then((post) => {
                post.coment.pull(cid)
                post.save()
            })
            await Coments.findByIdAndDelete(cid)
            return res.status(200).json({
                success: true,
                message: "coment delete succesfully",
            })
        } catch (error) {
            console.log(`error in delete coment controller api ${error}`);
            if (error.name = "CastError") {
                return res.status(401).send({
                    success: false,
                    message: "Please enter a valide post id",
                });
            }
            return res.status(400).json({
                success: false,
                message: "error in delete coment controller api",
                error
            });
        }
    }
    //update coment
const UpdateComentController = async(req, res) => {
    try {
        const { id } = req.params;
        const { coment } = req.body
        const comentFind = await Coments.findById(id)
        if (comentFind.user = req.user._id) {
            if (coment) comentFind.coment = coment;
            await comentFind.save();
        }
        return res.status(200).json({
            success: true,
            message: "coment update succesfully",
            comentFind
        })
    } catch (error) {
        console.log(`error in Update coment controller api ${error}`);
        if (error.name = "CastError") {
            return res.status(401).send({
                success: false,
                message: "Please enter a valide post id",
            });
        }
        return res.status(400).json({
            success: false,
            message: "error in update coment controller api",
            error
        });
    }
}

module.exports = {
    addComentController,
    deleteComentController,
    UpdateComentController
}