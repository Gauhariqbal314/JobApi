import dotenv from "dotenv";
import { connectDB } from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
    path : "./.env"
});

connectDB()
.then(() => {
    app.listen(process.env.PORT || 3000, () => {
        console.log(`Server is listening on port : ${process.env.PORT}`);
    });
})
.catch((error) => {
    console.log("MongoDB Connection Failed: ", error);
})