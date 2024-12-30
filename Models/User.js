import mongoose from "mongoose";
import moment from "moment";

const { Schema } = mongoose;

const UserSchema = new Schema({
	name: {
		type: String,
		required: true,
		trim: true,
	},
	mnumber: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		trim: true,
		unique: true,
		match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address."],
	},
	password: {
		type: String,
		required: true,
		minlength: 6,
	},
	role: {
		type: String,
		enum: ["admin", "manager", "intern"],
		default: "intern",
	},
	isAdmin: {
		type: Boolean,
		default: false,
	},
	profilePicture: {
		type: String,
		default: "",
	},
	linkedInURL: {
		type: String,
		default: "",
	},
	department: {
		type: String,
		default: "Not Assigned",
	},
	notifications: {
		type: [{ type: Schema.Types.ObjectId, ref: "Notification" }],
		default: [],
	},
	startDate: {
		type: Date,
		default: Date.now,
		set: (value) => moment(value).format("YYYY-MM-DD"), // Only date, no time
	},
});

export default mongoose.model("User", UserSchema);
