const express =require('express')
const { requireSignin } = require('../controllers/authController')
const router = express.Router()

const { helloCategory,postCategory, categoryList, categoryDetails,updateCategory, deleteCategory } = require('../controllers/categoryController')
const errorHandler = require('../helpers/errorHandler')


router.get('/welcome',helloCategory)
router.post('/postcategory',requireSignin,errorHandler,postCategory)
router.get('/categorylist',categoryList)
router.get('/categorydetails/:id',categoryDetails)
router.put('/updatecategory/:id',requireSignin,errorHandler,updateCategory)
router.delete('/deletecategory/:id',requireSignin,errorHandler,deleteCategory)
//default bata export gara module use garne // sabai router expot hunne vayo
module.exports=router;