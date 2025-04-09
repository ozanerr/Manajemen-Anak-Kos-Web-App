import mongoose from 'mongoose'

const ConnectDB = async() => {
    try {
        const connect = await mongoose.connect(process.env.MONGO_URI)
        console.log(`Database berhasil connect : ${connect.connection.host}`)
    } catch (error) {
        console.log(error.message)
    }
}

export default ConnectDB