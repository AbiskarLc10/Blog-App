require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT;
const cookieParser = require('cookie-parser');
const cors = require('cors');
const connect = require('./database/connection');
const userroute = require('./Router/user-router');
const authroute = require('./Router/auth-router');
const adminroute = require('./Router/post-router');
const commentroute = require("./Router/comment-router");
const errorMiddleware = require('./middleware/error-middleware');

const corsOptions = {
    origin:"http://localhost:5173",
    methods:"POST,GET,PUT,DELETE,PATCH",
    credentials:true
}

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use("/api/user",userroute);
app.use("/api/auth",authroute);
app.use("/api/admin",adminroute);
app.use("/api/comment",commentroute)

app.use(errorMiddleware);

connect().then(()=>{
    app.listen(port,()=>{


        console.log(`Listening at port ${port}`)
    })
}).catch(()=>{
    console.log("Error Occurred");
})





