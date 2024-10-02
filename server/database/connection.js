require('dotenv').config();
const mongoose = require('mongoose');
const url = process.env.DATABASE_URL;
const connectDbs = async () =>{

    try {

    const connection = await mongoose.connect(url);
    if(connection){

        console.log("Connected to database Successfully");

    }
        
    } catch (error) {
        
        console.log("Failed to Connect");
        process.exit(0);
    }
}


module.exports = connectDbs;