const mongoose = require('mongoose')

function connectToDB(){
    mongoose.connect(process.env.URI).then(()=>{
        console.log('Connected to db')
        
    })
}

module.exports = connectToDB