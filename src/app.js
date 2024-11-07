import express from "express";
import cors from "cors";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded({limit: "16kb", extended: true}));
app.use(express.static("public"));


// routes
import userRouter from "./routes/auth.route.js";
import jobsRouter from "./routes/jobs.route.js";

app.use("/api/v1/auth", userRouter);
app.use("/api/v1/jobs", jobsRouter);

// middlewares
import { notFound } from "./middlewares/notFound.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";

app.use(errorMiddleware);
app.use(notFound);

export { app }