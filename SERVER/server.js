import express from 'express'
import dotenv from 'dotenv'
import ConnectDB from './config/db.js'
import postRoutes from './routes/postRoutes.js'
import commentRoutes from './routes/commentRoutes.js'
import cors from 'cors'

dotenv.config()

const app = express()
app.use(express.json())
app.use(cors())

//route
app.use('/api/posts', postRoutes)

app.use('/api/comments', commentRoutes)

//connect database
ConnectDB()

//port
const port = process.env.PORT

//server
app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`)
})