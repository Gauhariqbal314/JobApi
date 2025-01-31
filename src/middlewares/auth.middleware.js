import { User } from "../models/user.models.js";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
    const token = 
        req.cookies?.accessToken || 
        req.header("Authorization")?.replace("Bearer ", "");

    if(!token) {
        throw new ApiError(401, "Invalid Authentication")
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decoded?._id).select("-password -refreshToken")

        if(!user) {
            throw new ApiError(401, "Unauthorized Request")
        }

        req.user = user
        next();
    } catch (error) {
        throw new ApiError(401, "Invalid Access token")
    }

})