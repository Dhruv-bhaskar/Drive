const express = require('express')
const { body,validationResult } = require('express-validator')
const userModel = require('../Models/user.model')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const router = express.Router()

router.get('/register', (req,res)=>{
    res.render('register')
})

router.post('/register',
    body('email').trim().isEmail().isLength({min:10}),
    body('username').trim().isLength({min:3}),
    body('password').trim().isLength({min:5}),
    async (req,res)=>{

    const errors = validationResult(req)
    
      if(!errors.isEmpty()){
        return res.status(400).json(
            {
                errors: errors.array(),
                message: 'Invalid data'
            }
        )
      }
    
    const{username, email, password} = req.body

    const hashPassword = await bcrypt.hash(password,10)

    const newUser = await userModel.create({
      username,
      email,
      password: hashPassword
    })

    res.redirect('/user/login')
})

router.get('/login', (req,res)=>{
  res.render('login')
})

router.post('/login',
  body('username').trim().isLength({min:3}),
  body('password').trim().isLength({min:5}),
  async (req,res)=>{

    const errors = validationResult(req)

    if(!errors.isEmpty()){
      return res.status(400).json({
        error: errors.array(),
        message: 'Invalid data'
      })
    }

    const {username, password} = req.body

    const user = await userModel.findOne({
      username: username
    })

    if(!user){
      return res.status(400).json({
        error: errors.array(),
        message: 'username or password is incorrect'
      })
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch){
      return res.status(400).json({
        error: errors.array(),
        message: 'username or password is incorrect'
      })
    }

    const token = jwt.sign({
      userId: user._id,
      email: user.email,
      username: user.username
    },
      process.env.JWT_SECRET,
  )

     res.cookie('token',token)
     res.redirect('/user/loggedin')
  } 
)

router.get('/unauthorized',(req,res)=>{
  res.render('unauthorized')
})

router.get('/loggedin', (req,res)=>{
  res.render('loggedIn')
})



module.exports = router
