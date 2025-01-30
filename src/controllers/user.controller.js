const userRegister = async (req, res) => {
  try {
    res.status(201).json({
      message: 'Registered successfully'
    })
  } catch (error) {
    console.log('Error in register: ', error)
  }
}


export { userRegister }
