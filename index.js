const express = require("express");
const app = express();
const mongoose =  require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");

const userRoute = require("./routes/users")
const authRoute = require("./routes/auth")
const postRoute = require("./routes/posts")

dotenv.config();

//connecting to mongoose 
mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true, useUnifiedTopology: true }, ()=>{
    console.log("Connected to MongoDB");  
})

//middleware
app.use(express.json());
app.use(helmet()); // Helmet helps you secure your Express apps by setting various HTTP headers.
app.use(morgan("common")); //HTTP request logger middleware for node.js

app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);

app.listen(8800, ()=>{
    console.log("Server is running!");  
})