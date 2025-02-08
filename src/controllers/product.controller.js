import { Product } from '../model/Product.model.js'
import { User } from '../model/user.model.js'

const addProduct = async (req, res) => {
  try {
    const { title, description, price, in_stock, Categories, rating } = req.body
    console.log('files', req.file)
    const imagePath = `/public/images/${req.file.filename}`

    const Admin = await User.findById(req.user._id)
    console.log('ad', Admin)
    if (!Admin.isAdmin) {
      return res.status(401).json({ message: "Unauthorized action" })
    }

    const product = await Product.create({
      title,
      description,
      price,
      in_stock,
      Categories,
      rating,
      image: imagePath
    })

    if (!product) {
      return res.status(500).json({
        message: 'Something went wrong'
      })
    }

    return res.status(201).json({
      data: product,
      message: "Product created successfully"
    })
  } catch (error) {
    console.log("Error while adding product", error)
    res.status(500).json({
      message: error
    })
  }
}



export { addProduct }