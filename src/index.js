import express from "express";
import dotenv from "dotenv";
import connectDB from './db/index.js';

const app = express();

app.use(express.json());
dotenv.config({ path: "./env" });

const port = process.env.PORT || 4000;

connectDB()
    .then(() => {
        app.listen(port, () => {
            console.log(`Server is running at port : ${port}`);
        })
        app.on("error", (error) => {
            console.log(`ERRR : ${error}`);
            throw error
        })
    })
    .catch((err) => {
        console.error(`MongoDB connection failed !!! ${err}`)
    })


export default app;