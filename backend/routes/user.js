const express = require("express")
const router = express.Router()
// const { body } = require('express-validator')
const bcrypt = require("bcryptjs") // for hashing passoword
var jwt = require('jsonwebtoken') //for sending auth token to logged in user
JWT_SECRET = process.env.JWT_SECRET //for sending auth token to logged in user
require('dotenv').config();

const userDataModel = require('../Modals/User')
const Authenticated = require('../middleware/auth');

// ROUTE 1: Register new user
router.post('/register', async (req, res) => {
    const { username, phone, email, password } = req.body;
    const checkEmail = await userDataModel.find({ email: email })
    const checkUsername = await userDataModel.find({ username: username })

    if (checkEmail == "" && checkUsername == "") {
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(password, salt)
        userDataModel.create({
            username: username,
            phone: phone,
            email: email,
            password: secPass
        })
        res.json({ message: "Account Created Successfully", success: true })
    }
    else {
        res.json({ message: "Email or username already exist", success: false })
    }
})

// ROUTER 2: Login
router.post('/login', async (req, res) => {

    const { email, password } = req.body;
    try {
        const user = await userDataModel.findOne({ email: email })
        if (!user) return res.json({ message: "User not found", success: false })

        const validPassword = await bcrypt.compare(password, user.password)
        if (!validPassword) return res.json({ message: "Invalid Credentials", success: false })

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' })

        //sending server side Cookies
        res.cookie('_xz', token, {
            sameSite: 'None',
            httpOnly: true,
            path: '/',
            secure: true,   // true in production with HTTPS
            expires: new Date(new Date().getTime() + 60 * 10000)
        });
        res.json({ message: "Welcome to InterestBook", user, success: true })

    } catch (error) {
        res.json({ message: error.message })
    }
})


// ROUTER 3: Get user Profile
router.get('/profile', Authenticated, async (req, res) => {
    userData = req.user
    res.json({ user: req.user, success: true })
    // console.log(userData)
})


// ROUTER 4: Get all User
router.get('/all', Authenticated, async (req, res) => {
    try {
        const allusers = await userDataModel.find()
        res.json(allusers)

    } catch (error) {
        res.json(error.message)
    }
})

// ROUTER 5: Logout (Clear serverside cookies)
router.get('/logout', async (req, res) => {
    try {
        res.clearCookie('_xz', {
            sameSite: 'None',
            httpOnly: true,
            path: '/',
            secure: true,
        });
        res.json({message:"Account Logged Out", success: true})

    } catch (error) {
        res.json(error.message)
    }
})

module.exports = router;