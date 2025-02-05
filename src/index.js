import dotenv from 'dotenv'
import express from 'express'
const app = express()
const port = 5000
const hostname = '127.0.0.1'
import { dbConnect } from './db/index.js'
import userRoutes from './routes/user.routes.js'
import cookieParser from 'cookie-parser'



dotenv.config()


dbConnect().then(() => {
  app.listen(port, () => {
    console.log(`Running on http://${hostname}:${port}`)
  })
})
  .catch((err) => {
    console.log("Error while connecting", err)
  })

app.use(express.json())
app.use(express.urlencoded())
app.use(express.static("public"))
app.use(cookieParser())

app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.use('/api/v1/auth', userRoutes)







