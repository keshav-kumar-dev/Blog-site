const express = require("express");
const helmet = require("helmet");
require("dotenv").config();
const db = require("./config/db");
const authRouter = require("./routes/authRoutes")
const cookieParser = require("cookie-parser")
const blogRouter = require("./routes/blogRoutes")

const app = express();
app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:true}))

app.use("/api/auth/", authRouter);
app.use("/api/blogs/",blogRouter);

db().then(()=>{
    console.log("Database connected")
    app.listen(process.env.PORT, ()=>{
        console.log("Server is running on port", process.env.PORT)
    })
})