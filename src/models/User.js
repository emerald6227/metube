import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    avatarUrl: String,
    socialOnly: { type: Number, default: false },
    username: { type: String, required: true, unique: true },
    password: { type: String },
    name: { type: String, required: true },
    location: String
});

userSchema.pre("save", async function() {
    try {
        this.password = await bcrypt.hash(this.password, 5);
    } catch (error) {
        console.log("password hashing error:", error);
    }
});

const User = mongoose.model("User", userSchema);

export default User;