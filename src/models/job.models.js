import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
    company : {
        type : String,
        required : true,
        trim : true,
        maxLength : 50
    },
    position : {
        type : String,
        required : true,
        trim : true,
        maxLength : 100
    },
    status : {
        type : String,
        enum : ["interview", "declined", "pending"],
        default : "pending"
    },
    createdBy : {
        type : mongoose.Types.ObjectId,
        ref : "User",
        required : true
    }
},
{
    timestamps : true,
    versionKey : false
});


export const Job = mongoose.model("Job", jobSchema);