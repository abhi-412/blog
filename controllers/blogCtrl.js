const validateMongodbId = require('../utils/validatemongodbID');
const asyncHandler = require("express-async-handler")
const Blog = require("../schema/blogSchema")

const createBlog = asyncHandler(async(req,res)=>{
   try {
        const {_id} = req.user;
        validateMongodbId(_id);
        const {
            title,
            description,
            category,
            images
        } = req.body;

        const newBlog = await Blog.create({
            title:title,
            description:description,
            category:category,
            images:images,
            author:_id,
            comments:[],
            likes:[],
            dislikes:[],
        })

        res.status(200).json(newBlog);
    
   } catch (error) {
        throw new Error(error);
   }
});


const getAllBlogs = asyncHandler(async(req,res)=>{
    try {
        const queryObj = { ...req.query };
        const excludeFields = ['page','sort','limit','fields','order'];
        excludeFields.forEach((el) => delete queryObj[el]);
        let queryStr = JSON.stringify(queryObj);

        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g,(match)=>`$${match}`);

        let query =  Blog.find(queryStr);

        //sorting

        if(req.query.sort){
            const sortBy = req.query.sort.split(',').join(' ');
            const sortOrder = req.query.order === 'asc' ? 1 : -1;
            query = query.sort({ [sortBy]: sortOrder })
        }else{
            query = query.sort("-createdAt")
        }

        //fields
        
        if(req.query.fields){
            const fields = req.query.fields.split(',').join(' ');
            query = query.select(fields);
        }else{  
            query = query.select('-__v');
        }

        //pagination

        const page = req.query.page ? parseInt(req.query.page ): 1;
        const limit = req.query.limit ? parseInt(req.query.limit) : 10;
        const skip = req.query.skip ? parseInt(req.query.skip) : (page - 1) * limit;

        query = query.skip(skip).limit(limit);
        const blogsNum = await Blog.countDocuments();
        const pages = blogsNum/limit;
        if(req.query.page){
            if(page > Math.ceil(blogsNum / limit)){
                throw new Error("This page does not exist");
            }else{
                query = query.skip(skip).limit(limit);
            }
        }

        const blogs = await Blog.find(query);
        res.status(200).json({blogs,curPage:page,totalPages:pages});
    } catch (error) {
        throw new Error(error);
    }
})


const getOneBlog = asyncHandler(async(req,res)=>{
    try {
        const {id} = req.params;
        validateMongodbId(id);
        const blog = await Blog.findById(id);
        res.status(200).json(blog);
        
    } catch (error) {
        throw new Error(error);
    }
})

const updateBlog = asyncHandler(async(req,res)=>{
    try {
        const {id} = req.params;
        validateMongodbId(id);

        const {
            title,
            description,
            category,
            images
        } = req.body;
        const blog = await Blog.findByIdAndUpdate(id,{
            title:title,
            description:description,
            category:category,
            images:images
        },{
            new:true    
        });
        res.status(200).json(blog);
    } catch (error) {
        throw new Error(error);
    }
})


const likeBlog = asyncHandler(async(req,res)=>{
   try {

        const {id} = req.params;
        validateMongodbId(id);


        const blog  = await Blog.findById(id);
        const userId = req.user._id;
        validateMongodbId(userId);


        const isDisliked = blog.isDisliked;
        const isLiked = blog.isLiked;


        if(isDisliked){
            const updatedBlog = await Blog.findByIdAndUpdate(id,{
                $pull:{dislikes:userId},
                $push:{likes:userId},
                isLiked:true,
                isDisliked:false,
                numViews:blog.numViews-1
            },{
                new:true
            })

            res.status(200).json(updatedBlog);
        }

        if(isLiked){
            const updatedBlog = await Blog.findByIdAndUpdate(id,{
                $pull:{likes:userId},
                isLiked:false,
                numViews:blog.numViews-1
            },{
                new:true
            })

            res.status(200).json(updatedBlog);
        }else{
            const updatedBlog = await Blog.findByIdAndUpdate(id,{
                $push:{likes:userId},
                isLiked:true,
                numViews:blog.numViews+1
            },{
                new:true
            })
            res.status(200).json(updatedBlog);
        }
    
   } catch (error) {
        throw new Error(error);
   }

    
})

const dislikeBlog = asyncHandler(async(req,res)=>{
    try {
 
         const {id} = req.params;
         validateMongodbId(id);
         const blog  = await Blog.findById(id);

         const userId = req.user._id;
         validateMongodbId(userId);

         const isDisliked = blog.isDisliked;
         const isLiked = blog.isLiked;
 
 
         if(isLiked){
             const updatedBlog = await Blog.findByIdAndUpdate(id,{
                 $pull:{likes:userId},
                 $push:{dislikes:userId},
                 isLiked:false,
                 isDisliked:true,
                 numViews:blog.numViews-1
             },{
                 new:true
             })
 
             res.status(200).json(updatedBlog);
         }
 
         if(isDisliked){
             const updatedBlog = await Blog.findByIdAndUpdate(id,{
                 $pull:{dislikes:userId},
                 isDisliked:false,
                 numViews:blog.numViews-1
             },{
                 new:true
             })
 
             res.status(200).json(updatedBlog);
         }else{
             const updatedBlog = await Blog.findByIdAndUpdate(id,{
                 $push:{dislikes:userId},
                 isDisliked:true,
                 numViews:blog.numViews+1
             },{
                 new:true
             })
             res.status(200).json(updatedBlog);
         }
     
    } catch (error) {
         throw new Error(error);
    }
 
     
 })

 const deleteBlog = asyncHandler(async(req,res)=>{
    try {
        const {id} = req.params;
        validateMongodbId(id);

        const blog = await Blog.findByIdAndDelete(id);
        res.status(200).json(blog);
    } catch (error) {
        throw new Error(error);
    }
 })