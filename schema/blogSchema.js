const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    images:[
        {
            url:String,
            public_id:String,
            name:String
        }
    ],
    numViews:{
        type:Number,
        default:0
    },
    isLiked:{
        type:Boolean,
        default:false
    },
    isDisliked:{
        type:Boolean,
        default:false
    },
    likes:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        }
    ],
    dislikes:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        }
    ],
    createdAt:{
        type:Date,
        default:Date.now
    },

    comments:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Comment"
    }]
},{
    timestamps:true
})

module.exports = mongoose.model('Blog',blogSchema);