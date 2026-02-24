const User = require("../models/User");
const bcrypt = require("bcrypt")

const sendToken = async (user,res)=>{
    
        const token =await user.signJWT();
        if(!token){
            throw new Error("Something went wrong");
        }
        res.cookie("token", token
        //     ,{
        //     httpOnly: true,
        //     // secure:process.env.NODE_ENV === "production",
        //     // sameSite:"Strict",
        //     maxAge: 24*60*60*1000
        // }
    );
    return token;
}

const register = async(req,res)=>{
    try{        
        const {name,email,password} = req.body;
        
         if(!name || !email || !password){
            throw new Error("All fileds are required");
        }

        const passwordHash = await bcrypt.hash(password,10);
        
        const user = new User({
            name,
            email,
            password : passwordHash
        });
        await user.save();
        await sendToken(user,res);

        res.status(201).json({message : "User Successfully register", data : user})
    }catch(err){
        res.status(400).send(err.message)
    }
}

const login = async(req,res)=>{
    try{

        const {email,password} = req.body;

        if(!email || !password){
            throw new Error("Email and Password is required");
        }

        const user = await User.findOne({email});
        if(!user){
            throw new Error("Invalid credentials")
        }

        const passwordHash = user.password;

        bcrypt.compare(password,passwordHash,(err,isMatch)=>{
            if(err){
                throw err;
            }else if(!isMatch){
                throw new Error("Invalid credentials")
            }
        });

        await sendToken(user,res);

        res.status(201).json({message : "User Successfully logged in", data : user})
    }catch(err){
        res.status(400).send(err.message)
    }
}


const profile = async(req,res)=>{
    try{

        const user = req.user;
        
        res.status(201).json({message : "User Profile", data : user})
    }catch(err){
        res.status(400).send(err.message)
    }
}

module.exports = {register,login,profile};