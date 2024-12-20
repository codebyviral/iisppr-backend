import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

const corsOptions = {
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}
app.use(cors(corsOptions))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());