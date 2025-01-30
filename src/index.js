import dotenv from 'dotenv'
import express from 'express'
const app = express()
const port = 5000
const hostname = '127.0.0.1'
import { dbConnect } from './db/index.js'
import userRoutes from './routes/user.routes.js'



dotenv.config()


dbConnect()

app.use(express.json())
app.use(express.urlencoded())
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/api/v1/auth', userRoutes)





app.listen(port, () => {
  console.log(`Running on http://${hostname}:${port}`)
})


