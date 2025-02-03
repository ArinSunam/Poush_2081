import { User } from "../model/user.model.js"


const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId)
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()

    user.refresh_token = refreshToken
    user.save({ validateBeforeSave: false })

    return { accessToken, refreshToken }
  } catch (error) {
    console.log('Error generating token', error)

  }
}

const userRegister = async (req, res) => {
  try {
    const { email, password, fullname } = req.body
    const isExist = await User.findOne({ email: email })
    if (isExist) return res.status(409).json({ message: "User Already exists" })

    const reqfiles = req.file
    console.log(reqfiles)
    const fileUrl = `/uploads/images/${req.file.filename}`

    const user = await User.create({
      email,
      fullname,
      password,
      profile_pic: fileUrl
    })

    const createdUser = await User.findById(user._id).select("-password -refresh_token")

    if (!createdUser) {
      return res.status(500).json({
        message: "something went wrong"
      })
    }

    return res.status(201).json({
      message: "User registerd successful",
      data: createdUser
    })


  } catch (error) {
    console.log("Eror in register", error)
  }
}

const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email) {
      return res.status(400).json({
        message: "Email is required"
      })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({
        message: "User not found"
      })
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid Credentials" })
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)

    console.log('acs token', accessToken)
    console.log('ref token', refreshToken)

    const loggedInUser = await User.findById(user._id).select("-password -refresh_token")

    const options = {
      httpOnly: true,
      secure: true
    }
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options).
      json({
        message: "Successfully logged in",
        data: loggedInUser
      })


  } catch (error) {
    console.log('something went wrong', error)
    res.status(500).json({ message: "something went wrong" })
  }
}

const userLogout = async (req, res) => {
  console.log(req.user)
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refresh_token: undefined
      }
    },
    {
      new: true
    }
  )

  const options = {
    httpOnly: true,
    secure: true
  }

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json({
      message: "User LoggedOut Successfully"
    })
}



export { userRegister, userLogin, userLogout } 