import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        minLength : 3,
        maxLength : 50,
        index : true
    },
    email :{
        type : String,
        required : true,
        lowercase : true,
        unique : true,
        index : true
    },
    password : {
        type : String,
        required : true,
        minLength : 6,
    }
},
{
    timestamps : true,
    versionKey : false
})

userSchema.pre("save", async function(next) {
    if(!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

// userSchema.post("save", async function(user, next) {
//     const jobProfile = await User.findOne({owner : user._id});

//     if(!jobProfile) {
//         await User.create({owner : user._id});
//     }
//     next();
// })

userSchema.methods.isPasswordCorrect = async function(password) {
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id : this._id,
            name : this.name,
            email : this.email
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn : process.env.ACCESS_TOKEN_EXPIRY}
    )
}

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id : this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {expiresIn : process.env.REFRESH_TOKEN_EXPIRY}
    )
}

export const User = mongoose.model("User", userSchema);