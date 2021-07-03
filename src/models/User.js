import mongoose from "mongoose";
import bcrypt from "bcrypt";
import Video from './Video';
import Comment from './Comment';

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    avatarUrl: { type: String, default: "" },
    socialOnly: { type: Number, default: false },
    username: { type: String, required: true, unique: true },
    password: { type: String },
    name: { type: String, required: true },
    location: String,
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
    videos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Video" }]
});

userSchema.pre("save", async function() {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 5);
    }
});

const deleteUserVideoCascade = async (userId) => {
    // 1. 탈퇴유저 비디오
    const videos = await Video.find({ owner: userId });
    let videoIdList = [];
    for (const video of videos) {
        videoIdList.push(video._id);
    }

    // 2. 탈퇴유저 비디오의 모든 comment id
    const comments = await Comment.find({ video: videoIdList });
    let commentIdList = [];
    for (const comment of comments) {
        commentIdList.push(comment._id);
    }

    // * 3. 탈퇴유저 비디오 쓰레기값 처리 *
    // Video) 탈퇴유저 비디오들에 달려있는 모든 comment들 업데이트
    await Video.updateMany(
        {},
        { $pull: { comments: { $in: commentIdList }}}
    );

    // User) 탈퇴유저 비디오에 댓글을 달았던 모든 유저의 Obj에서 comment 삭제
    await User.updateMany(
        {},
        { $pull: { comments: { $in: commentIdList }}}
    );
    
    // Comment) 탈퇴유저 비디오의 모든 comment들 삭제
    await Comment.deleteMany({ _id: commentIdList });
};

const otherUserVideoCascade = async (userId) => {
    // 1. 탈퇴 유저와 연관된 모든 comments를 삭제한다.
    await Comment.deleteMany({ owner: userId });

    // 2. 해당 유저의 모든 video를 삭제한다.
    await Video.deleteMany({ owner: userId });

    // 다른 유저의 비디오에 있는 탈퇴유저의 comment 삭제 필요
    // 3. 탈퇴유저의 모든 comments id를 가져와서 list로 만든다.
    const deleteUser = await User.findById(userId);
    let deleteUserCommentIdList = [];
    for (const deleteUserCommentId of deleteUser.comments) {
        deleteUserCommentIdList.push(String(deleteUserCommentId));
    }

    // 4. Video Obj에서 해당 comments id 와 일치하는 데이터들을 삭제 및 업데이트
    await Video.updateMany(
        {},
        { $pull: { comments: { $in: deleteUserCommentIdList }}}
    )
};

userSchema.pre("findOneAndDelete", async function(next) {
    const userId = this._conditions._id;

    // 탈퇴 유저가 업로드한 비디오 기준 연쇄 삭제
    await deleteUserVideoCascade(userId);

    // 다른 유저가 업로드한 비디오 기준 연쇄 삭제
    await otherUserVideoCascade(userId);

    next();
});

const User = mongoose.model("User", userSchema);

export default User;