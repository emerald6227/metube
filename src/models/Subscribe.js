import mongoose from "mongoose";

const subscribeSchema = new mongoose.Schema({
    subscribeTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    subscribeFrom: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    createdAt: { type: Date, required: true, default: Date.now }
});

const Subscribe = mongoose.model("Subscribe", subscribeSchema);

export default Subscribe;