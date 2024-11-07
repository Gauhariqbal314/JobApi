import { Router } from "express";
import { getAllJobs, 
    getJob, 
    createJob, 
    updateJob, 
    deleteJob 
} from "../controllers/jobs.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route('/createJob').post(verifyJWT, createJob)
router.route('/getAllJobs').get(verifyJWT, getAllJobs)
router.route('/getJob/:id').get(verifyJWT, getJob)
router.route('/update/:id').patch(verifyJWT, updateJob)
router.route('/delete/:id').delete(verifyJWT, deleteJob)


export default router 