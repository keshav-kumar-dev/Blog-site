const mongoose = require("mongoose");
const validator = require("validator")
const jwt = require("jsonwebtoken")

const userSchema = new mongoose.Schema({

    name:{
        type : String,
        required : true,
        trim : true
    },
    email:{
        type : String,
        required : true,
        unique:true,
        trim:true,
        lowercase:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid email")
            }
        }
    },
    password:{
        type:String,
        required:true,
        trim:true,
        minlength : 8,
        validate(value){
            if(!value.match(/\d/) || !value.match(/[a-zA-Z]/) || !validator.isStrongPassword(value)){
                throw new Error("Password should be strong, min length is 8");
            }
        }
    }
    
},
{
    timestamps:true
}
)

userSchema.methods.signJWT =async function (){
    const user = this;

    const token = jwt.sign({id : user._id.toString()},process.env.JWT_SECRET,{
        expiresIn:"1d"
    });

    return token;
}

const User = mongoose.model("User", userSchema);
module.exports= User;