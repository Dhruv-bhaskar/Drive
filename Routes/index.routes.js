const express = require('express')
const multer = require('multer')
const path = require('path')
const cloudinary = require('cloudinary').v2
const fileModel = require('../Models/file.model')
const authMiddleware = require('../middlewares/authe')
const mongoose = require('mongoose');
const dotenv = require('dotenv')
const router = express.Router()

dotenv.config()

cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

const storage = multer.diskStorage({
    //destination: './public/uploads',
    filename: function (req, file, cb) {
      
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
  })
  
  const upload = multer({ storage: storage })

router.get('/upload', authMiddleware, (req,res)=>{
    res.render('home', {url: null})
    
})

router.post('/upload-file', authMiddleware, upload.single('file'), async (req, res)=>{
    //  console.log('This is my file', req.file);
      const file = req.file.path

      const cloudinaryRespone = await cloudinary.uploader.upload(file,{
        folder: 'Drive (backend_project)'
      })

      const key = req.cookies.token


      const saveTodb = await fileModel.create({
        filename: file.originalname,
        public_Id: cloudinaryRespone.public_id,
        img_url: cloudinaryRespone.secure_url,
        user: req.user.userId,
      })

      res.render('home', {url: cloudinaryRespone.secure_url})

      // console.log('cloudinary response', cloudinaryRespone);
      
  })
  
  router.get('/', (req, res)=>{
    res.render('drive')
    
  })

  router.get('/images', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.userId; // Access userId from req.user

        const userImages = await fileModel.find({ user: userId }).select('img_url -_id');
         res.render('image', {imageUrls: userImages});
  
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching user images' });
    }
})



module.exports = router