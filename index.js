const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const dbConnect = require('./utils/dbConnect');

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

dotenv.config();


const server = app.listen(port,()=>{
    dbConnect();
    console.log(`Server running on port ${port}`)
})