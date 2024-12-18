import mongoose from 'mongoose';

const { Schema } = mongoose;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    mnumber: {
        type: Number,
        required: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address.'],
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    role: {
        type: String,
        enum: ['admin', 'manager', 'intern'],
        default: 'intern',
    },
});

const User = mongoose.model('users', UserSchema);
export default User;
