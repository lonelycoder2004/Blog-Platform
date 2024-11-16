const mongoose=require('mongoose');

const blogmodelSchema=new mongoose.Schema({
    date:{
        type:Date,
        default:Date.now
    },
    authorname:{
        type:String
    },
    name:{
        type:String
    },
    longdescription:{
        type:String
    },
    category:{
        type:String
    },
    uniquename:{
        type:String,  
    }
});

module.exports=mongoose.model("blogmodel",blogmodelSchema);