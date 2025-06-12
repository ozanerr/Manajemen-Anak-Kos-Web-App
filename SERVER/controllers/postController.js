import Post from "../models/postModel.js";

const createPost = async (req, res) => {
    try {
        const { uid, judul, deskripsi, kota, gambar, username, imageProfile } =
            req.body;

        const newPost = await Post.create({
            uid,
            judul,
            deskripsi,
            kota,
            gambar,
            username,
            imageProfile,
        });

        const io = req.app.get("socketio");
        io.emit("newPost", newPost);

        return res.status(201).json({
            status: "Success",
            data: newPost,
        });
    } catch (error) {
        res.status(400).json({
            status: "Failed",
            error: error.message,
        });
    }
};

const getPosts = async (req, res) => {
    try {
        const posts = await Post.find();

        return res.status(201).json({
            status: "Success",
            data: posts,
        });
    } catch (error) {
        res.status(400).json({
            status: "Failed",
            error: error.message,
        });
    }
};

const getPostByUid = async (req, res) => {
    try {
        const { uid } = req.params;

        const ownPost = await Post.find({ uid: uid });

        return res.status(201).json({
            status: "Success",
            data: ownPost,
        });
    } catch (error) {
        res.status(400).json({
            status: "Failed",
            error: error.message,
        });
    }
};

const getPostById = async (req, res) => {
    try {
        const { postId } = req.params;
        const postById = await Post.find({ _id: postId });

        return res.status(201).json({
            status: "Success",
            data: postById,
        });
    } catch (error) {
        res.status(400).json({
            status: "Failed",
            error: error.message,
        });
    }
};

const editPost = async (req, res) => {
    try {
        const { postId } = req.params;

        const { judul, deskripsi, kota, gambar } = req.body;

        const editedPost = await Post.findOneAndUpdate(
            { _id: postId },
            {
                $set: {
                    judul: judul,
                    deskripsi: deskripsi,
                    kota: kota,
                    gambar: gambar,
                },
            },
            { new: true }
        );

        const io = req.app.get("socketio");
        io.emit("postUpdated", editedPost);

        return res.status(201).json({
            status: "Success",
            data: editedPost,
        });
    } catch (error) {
        res.status(400).json({
            status: "Failed",
            error: error.message,
        });
    }
};

const deletePost = async (req, res) => {
    try {
        const { postId } = req.params;

        const deletedPost = await Post.findOneAndDelete({ _id: postId });

        const io = req.app.get("socketio");
        io.emit("postDeleted", { postId: postId });

        return res.status(201).json({
            status: "Success",
            data: deletedPost,
        });
    } catch (error) {
        res.status(400).json({
            status: "Failed",
            error: error.message,
        });
    }
};

export {
    createPost,
    getPosts,
    getPostByUid,
    editPost,
    deletePost,
    getPostById,
};
