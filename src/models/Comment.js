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

    //1. User id로 찾아서 해당 comment안의 id 삭제
    const userResult = await User.findOneAndUpdate({ comments: commentId }, { $pull: { comments: commentId } });
    // 2. Video id로 찾아서 해당 comment안의 id 삭제
    const videoResult = await Video.findOneAndUpdate({ comments: commentId }, { $pull: { comments: commentId } });

    next();
});

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;