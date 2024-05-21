const mongoose = require("mongoose")
require("dotenv").config()

mongoose.connect(process.env.MONGO_URL,{
}).then(()=>{
    console.log("DB Connection Successful");
}).catch(err =>console.log("Error Connecting To DB"+err))