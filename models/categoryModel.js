const mongoose = require('mongoose')

const  categorySchema = new  mongoose.Schema(
    {
        category_name:{
            type:String,
            required:true,
            trim:true
        }
    },{timestamps:true}
)   

// created at
// updated at

module.exports=mongoose.model('Category',categorySchema)