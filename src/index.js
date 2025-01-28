import dotenv from 'dotenv'
import express from 'express'
const app = express()
const port = 3000
const hostname = '127.0.0.1'
import { dbConnect } from './db/index.js'

dotenv.config()


dbConnect()

app.use(express.json())
app.use(express.urlencoded())
app.get('/', (req, res) => {
  res.send('Hello World!')
})


app.listen(port, () => {
  console.log(`Running on http://${hostname}:${port}`)
})


