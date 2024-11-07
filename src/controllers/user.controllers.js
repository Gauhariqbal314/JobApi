import { User } from "../models/user.models.js";
import { asyncHandler} from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";


const generateRefreshAccessToken = async (userId) => {
    try {
        const user = await User.findById(userId)

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;

        await user.save({ validateBeforeSave : false })

        return { accessToken, refreshToken }

    } catch (error) {
        throw new ApiError(
            500,
            "Something went wrong while generating access token and refresh token"
        )
    }
}


const registerUser = asyncHandler (async (req, res) => {
    const { name, email, password } = req.body;

    if([name, email, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    const existedUser = await User.findOne({
        $or : [{ email }, { name }]
    });
    
    if(existedUser) {
        throw new ApiError(400, "User with this email or name already exists");
    }

    const user = await User.create({
        name,
        email,
        password
    });

    const createdUser = await User.findById(user._id).select("-password");

    if(!createdUser) {
        throw new ApiError(500, "Something went wrong while creating user");
    }

    const { accessToken, refreshToken } = await generateRefreshAccessToken(
        user._id
    )


    return res.status(200).json(
        new ApiResponse(
            200, 
            {createdUser,
            accessToken , refreshToken},
            "User created successfully"
        )
    )

})

const loginUser = asyncHandler (async (req, res) => {
    const { email, password } = req.body

    if(!email) {
        throw new ApiError(400, "Email is required")
    }

    const user = await User.findOne({ email })

    if(!user) {
        throw new ApiError(400, "User not found")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if(!isPasswordValid) {
        throw new ApiError(400, "Incorrect password")
    }

    const { accessToken, refreshToken } = await generateRefreshAccessToken(
        user._id
    )

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    if(!loggedInUser) {
        throw new ApiError(500, "Something went wrong while logging in")
    }

    const options = {
        httpOnly : true,
        secure : process.env.NODE_ENV === "production",
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(200,
        { user : loggedInUser, accessToken, refreshToken },
        "User logged in successfully")
    )

})

const logoutUser = asyncHandler (async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id, 
        {
            $set : {
                refreshToken : ""
            }
        },
        { 
            new : true 
        }
    )

    const options = {
        httpOnly : true,
        secure : process.env.NODE_ENV === "production"
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(
        new ApiResponse(200, 
            {}, 
            "User logged out successfully")
    )
})



export { registerUser, 
    loginUser,
    logoutUser
}