require('dotenv').config();
var jwt = require('jsonwebtoken')
JWT_SECRET = process.env.JWT_SECRET //for sending auth token to logged in user

const userDataModel = require('../Modals/User');

const Authenticated = async (req, res, next) => {
    const token = req.cookies._xz //won't come immediately after login pressed

    if (!token) return res.json({ message: "Login First" })

    const decoded = jwt.verify(token, JWT_SECRET)
    const id = decoded.userId

    let user = await userDataModel.findById(id).select('-password')
    if (!user) return res.json({ message: "User doesn't exist" })
    req.user = user
    next();
}
module.exports = Authenticated;