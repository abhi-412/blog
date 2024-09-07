const mongoose  = require('mongoose');
const User = require('../schema/userSchema');
const asyncHandler = require('express-async-handler');
const {generateRefreshToken, refreshToken} = require('../config/refreshtoken.js');

const loginUser = asyncHandler(async(req,res)=>{
    const {email, password} = req.body;
    if(!email || !password){
        res.status(400);
        throw new Error('Please add email and password');
    }
    const user = await User.findOne({email});

    if(!user){
        res.status(400).send({message:"User not found"});
    }else{
        const isMatch = await user.isPasswordMatched(password);
        if(!isMatch){
            res.status(400).send({message:"Invalid credentials"});
        }else{
            const token = generateRefreshToken(user._id);
            const updatedUser = await User.findByIdAndUpdate(user._id,{
                refreshToken:token
            },{
                new:true
            })

            res.cookie('refresh',token,{
                httpOnly:true,
                maxAge:72*60*60*1000
            })

            res.json{
               
            }
        }
    }
})