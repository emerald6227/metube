import mongoose from "mongoose";
import User from './User';
import Video from './Video';

const commentSchema = new mongoose.Schema({
    text: { type: String, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    video: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Video" },
    createdAt: { type: Date, required: true, default: Date.now },
});

commentSchema.pre("findOneAndDelete", async function(next) {
    const commentId = this._conditions._id;

    // delete cascade
    const userResult = await User.findOneAndUpdate({ comments: commentId }, { $pull: { comments: commentId } });

    const videoResult = await Video.findOneAndUpdate({ comments: commentId }, { $pull: { comments: commentId } });

    next();
});

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;