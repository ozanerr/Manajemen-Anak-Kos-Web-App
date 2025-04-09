import Post from "../models/postModel.js";

const createPost = async(req, res) => {
    try {
        const newPost = await Post.create(req.body)

        return res.status(201).json({
            status: "Success",
            data: newPost
        })
    } catch (error) {
        res.status(400).json({
            status: 'Failed',
            error: error.message
        })
    }
}

const getPosts = async(req, res) => {
    try {
        const posts = await Post.find()

        return res.status(201).json({
            status: "Success",
            data: posts
        })
    } catch (error) {
        res.status(400).json({
            status: 'Failed',
            error: error.message
        })
    }
}

const getPostById = async(req, res) => {
    try {
        const postById = await Post.findById(req.params.postId)

        return res.status(201).json({
            status: 'Success',
            data: postById
        })
    } catch (error) {
        res.status(400).json({
            status: 'Failed',
            error: error.message
        })
    }
}

const editPost = async (req, res) => {
    try {
        const { postId } = req.params

        const { title, description, category, image } = req.body

        const editedPost = await Post.findOneAndUpdate(
            {_id: postId},
            {$set: {
                title: title,
                description: description,
                category: category,
                image: image
            }
            },
            {new: true}
        )

        return res.status(201).json({
            status: 'Success',
            data: editedPost
        })
    } catch (error) {
        res.status(400).json({
            status: 'Failed',
            error: error.message
        })
    }
}

const deletePost = async (req, res) => {
    try {
        const { postId } = req.params

        const deletedPost = await Post.findOneAndDelete({_id: postId})

        return res.status(201).json({
            status: 'Success',
            data: deletedPost
        })
    } catch (error) {
        res.status(400).json({
            status: 'Failed',
            error: error.message
        })
    }
}

export{
    createPost,
    getPosts,
    getPostById,
    editPost,
    deletePost
}