import mongoose  from 'mongoose';
const Schema = mongoose.Schema;
const internSchema= new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true ,unique:true},
    address: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    university: { type: String, required: true },
    degree: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    department: { type: String, required: true }
});
const Interns= mongoose.model("Interns",internSchema);

export default Interns;
