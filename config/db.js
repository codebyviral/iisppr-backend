import mongoose from "mongoose";

export const connectDB=async()=>{
    await mongoose.connect('mongodb+srv://yaha pe mongo ki url aayegi').then(()=>console.log("DB connected"));
}