import { User } from "../model/user.model.js"

const userRegister = async (req, res) => {
  try {

    //accept data from client
    //check whether the user already exists
    //take file url
    //create user
    //remove the unnecessary fields from user and sent the response

    const { fullname, email, password } = req.body

    const isExist = await User.findOne({ email: email })
    if (isExist) {
      res.status(409).json({
        message: 'User already exists'
      })
    }

    const photoUrl = `public/images/${req.file.filename}`
    const user = await User.create({
      fullname,
      email,
      password,
      profile_pic: photoUrl
    })

    const createdUser = await User.findById(user._id).select("-password -refreshToken")

    if (!createdUser) {
      res.status(500).json({
        message: "Some error occured while registering"
      })
    }

    return res.status(201).json({
      message: "User Successfully registered",
      data: createdUser
    })

  } catch (error) {
    console.log("error in registering:", error)
    res.status(500).json({
      message: "Something went wrong"
    })
  }
}


export { userRegister }
