import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  subTitle: { type: String, trim: true },
  description: { type: String, required: true, trim: true },
  image: { type: String, required: true },
  createdBy: { type: String, required: true }
});


export default mongoose.model("Project", ProjectSchema);
