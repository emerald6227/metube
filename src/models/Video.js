import mongoose from "mongoose";
import User from './User';
import Comment from './Comment';

const videoSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true, maxLength: 80 },
    fileUrl: { type: String, required: true },
    thumbUrl: { type: String, required: true },
    description: { type: String, required: true, trim: true, minLength: 2 },
    createdAt: { type: Date, required: true, default: Date.now },
    hashtags: [{ type: String, trim: true }],
    meta: {
        views: { type: Number, default: 0, required: true },
        rating: { type: Number, default: 0, required: true }
    },
    comments: [{ type: mongoose.Schema.Types.ObjectId, required: true, ref: "Comment" }],
    owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" }
});

videoSchema.static("formatHashtags", function(hashtags) {
    return hashtags.split(",").map(word => word.startsWith("#") ? word: `#${word}`);
});

videoSchema.pre("findOneAndDelete", async function(next) {
    const videoId = this._conditions._id;

    // delete cascade 
    const userVideoDelete = await User.findOneAndUpdate({ videos: videoId }, { $pull: { videos: videoId } });
    
    const commentObjList = await Comment.find({ video: videoId });
    let commentIdList = [];
    for (const commentObj of commentObjList) {
        commentIdList.push(String(commentObj._id));
    }

    const userCommentDelete = await User.updateMany(
        {},
        { $pull: { comments: { $in: commentIdList }}}
    );

    const commentDelete = await Comment.deleteMany({ video: videoId });

    next();
});

const Video = mongoose.model("Video", videoSchema);

export default Video;