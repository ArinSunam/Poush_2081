import mongoose from "mongoose";


export const dbConnect = async () => {
  try {
    const mongoInstance = await mongoose.connect(`${process.env.MONGODB_URI}`)
    console.log(`Mongodb connected !! Host: ${mongoInstance.connection.host}`)
  } catch (error) {
    console.log("MONGODB CONNECTION ERROR:", error)
    process.exit(1)
  }
}
