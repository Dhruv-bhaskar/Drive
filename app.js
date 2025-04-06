const express = require('express')
const userRouter = require('./Routes/user.routes')
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')
const indexRouter = require('./Routes/index.routes')

dotenv.config()
const connectToDB = require('./config/db')
connectToDB()

const app = express()

app.use(express.json())
app.use(express.urlencoded({extented:true}))
app.use(cookieParser())

app.set('view engine','ejs')

app.use('/', indexRouter)
app.use('/user',userRouter)

// process.on('uncaughtException', (err)=>{
//     console.log('uncaughtException');
//     console.log('err');
// })   // ye err ko handle karne ki last stage hoti hai globally ismein server band nhi hota par response
        // bhi nhi aata sabse pehli uproach rehti hai try catch block ka use
        //  res.status(500).json({
        //    message: 'Server error'
        // })

app.listen(5000,()=>{
    console.log('Server is running on port 5000');
    
})