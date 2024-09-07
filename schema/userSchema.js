// const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const cryptoGraph = require('crypto')

const userSchema = new mongoose.Schema({
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        isAdmin: {
            type: Boolean,
            default: false
        },
        mobile:{
            type:String,
            required:true,
            unique:true,
        },
        pic: {
            type: String,
            default: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
        },
        token: {
            type: String
        },
        numViews: {
            type: Number,
            default: 0
        },
        numComments: {
            type: Number,
            default: 0
        },
        numFavourites: {
            type: Number,
            default: 0
        },
        numFollowers: {
            type: Number,
            default: 0
        },
        numFollowing: {
            type: Number,
            default: 0
        },
        numPosts: {
            type: Number,
            default: 0
        },
        followers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ],
        following:[
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ],

        favourites: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Post"
            }
        ],

        comments: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Comment"
            }   
        ],

        posts: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Blog"
            }
        ],

        bio: {
            type: String
        },

        website: {
            type: String
        },

        location: {
            type: String
        },
        refreshToken:{
            type:String,
        },

        passwordChangedAt:Date,
        passwordResetToken:String,
        passwordResetExpires:Date,
    });

    userSchema.pre('save',async(next)=>{
        if(!this.isModified('password')){
            next();
        }
        const salt = await bcrypt.genSaltSync(10);
        this.password = await bcrypt.hash(this.password , salt);
    })

    userSchema.methods.isPasswordMatched = async(enteredPassword)=>{
        return await bcrypt.compare(enteredPassword,this.password);
    }

    userSchema.methods.createPasswordResetToken = async()=>{
        const resetToken = cryptoGraph.randomBytes(32).toString("hex");
        this.passwordResetToken = cryptoGraph.createHash('sha256').update(resetToken).digest("hex")
        this.passwordResetExpires = Date.now() + 30 * 60 * 1000;
        return resetToken; 
    }

    module.exports = mongoose.model('User', userSchema);