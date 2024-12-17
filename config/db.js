import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const mongo_uri = process.env.MONGO_URI;

const connectToDataBase = async () => {
    try {
        await mongoose.connect(mongo_uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log(`Database connection successful 🎉`)
    } catch (error) {
        console.log(`Database connection Error ❌. ${error}`);
        process.exit(0);
    }
}

export { connectToDataBase }