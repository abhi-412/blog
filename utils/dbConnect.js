const mongoose = require('mongoose');

const dbConnect = ()=>{
    try{
        const connection = mongoose.connect(process.env.MONGODB_URL);
        connection.then(()=>{console.log("connected to DB")});
    }catch(err){
        console.log(err)
    }
}

module.exports = dbConnect;