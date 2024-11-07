import { ApiResponse } from "../utils/apiResponse.js"
import { ApiError } from "../utils/apiError.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { Job } from "../models/job.models.js"


const getAllJobs = asyncHandler (async (req, res) => {
    const jobs = await Job.find({createdBy : req.user._id}).sort('-createdAt')
    
    return res
    .status(200)
    .json(
        new ApiResponse(200,
            {jobs, nbHits : jobs.length},
            'fetched jobs',
        )
    )
})

const getJob = asyncHandler (async (req, res) => {
    const { user : {_id : userId}, params : { id : jobId }} = req

    const job = await Job.findOne({ _id : jobId, createdBy : userId })

    if(!job) {
        throw new ApiError(404, 'Job Not Found')
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200,
            {job},
            'fetched job',
        )
    )
})

const createJob = asyncHandler (async (req, res) => {
    req.body.createdBy = req.user._id

    const job = await Job.create(req.body)
    return res
    .status(201)
    .json(
        new ApiResponse(200,
            {job},
            'created job')
    )
})

const updateJob = asyncHandler (async (req, res) => {
    const { 
        body : {company, position},
        user : {_id : userId}, 
        params : { id : jobId }
    } = req

    if(company === "" || position === "") {
        throw new ApiError(400, 'Company or Position fields cannot be empty')
    }

    const job = await Job.findOneAndUpdate(
        {_id : jobId, createdBy : userId},
        req.body,
        {new : true, runValidators : true}
    )

    if(!job) {
        throw new ApiError(404, 'Job Not Found')
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200,
            {job},
            'updated job')
    )
})

const deleteJob = asyncHandler(async (req, res) => {
    const {
        user : {_id : userId}, 
        params : { id : jobId }
    } = req

    const job = await Job.findOneAndDelete({_id : jobId, createdBy : userId})

    if(!job) {
        throw new ApiError(404, 'Job Not Found')
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200,
            {job},
            'Job Deleted')
    )
})


export { getAllJobs, 
    getJob, 
    createJob, 
    updateJob, 
    deleteJob 
}