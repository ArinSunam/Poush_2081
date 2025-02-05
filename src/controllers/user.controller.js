import { User } from "../model/user.model.js"
import jwt from "jsonwebtoken"


const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId)
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()

    user.refreshToken = refreshToken
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

const getUser = async (req, res) => {
  try {
    res.status(200).json({
      data: req.user,
      message: "User fetched Successfully"
    })
  } catch (error) {
    console.log("Error while fetching user:", error.message)
    res.status(500).json({ message: error.message })
  }
}


const refreshAccessToken = async (req, res) => {
  //extract refresh token
  //validate refresh token
  //decode refresh token -- extract id
  //find user 
  // generate access token 
  // set in cookie

  try {
    const fetchedRefToken = req.cookies?.refreshToken
    console.log("fetch ref", fetchedRefToken)


    if (!fetchedRefToken) {
      return res.status(401).json({
        message: "Unauthorized request"
      })
    }

    const decodedToken = jwt.verify(fetchedRefToken, process.env.REFRESH_TOKEN_SECRET
    )

    const user = await User.findById(decodedToken?._id)
    if (!user) {
      return res.status(401).json({ message: "Invalid refresh token" })
    }
    console.log(user)
    console.log('user ref', user.refreshToken)
    if (fetchedRefToken !== user?.refreshToken) {
      return res.status(401).json({
        message: "Refresh token is expired"
      })
    }

    const options = {
      httpOnly: true,
      secure: true
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)
    res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({
        accessToken: accessToken,
        refreshToken: refreshToken,
        message: "Successfully generated access token"
      })


  } catch (error) {
    console.log("error in access token generation", error)
    res.status(500).json({
      error: error
    })
  }
}

const updateUserDetails = async (req, res) => {
  try {
    const { fullname, email } = req.body

    if (!fullname || !email) {
      return res.status(400).json({
        message: "All fields are required"
      })
    }

    const user = await User.findByIdAndUpdate(
      req.user?._id,
      {
        $set: {
          fullname,
          email
        }
      },
      {
        new: true
      }
    ).select("-password")

    return res.status(200).json({
      data: user,
      message: "User updated successfully"
    })
  } catch (error) {
    console.log("error in updating user", error)
    return res.status(500).json(error)
  }
}


const updatePassword = async (req, res) => {

  //try catch ma rakhne
  //req old and new password, confPass from user
  //confirm old password
  //validation
  //fetch user  by id
  //update password
  //sent response
}


export { userRegister, userLogin, userLogout, getUser, refreshAccessToken, updateUserDetails } 