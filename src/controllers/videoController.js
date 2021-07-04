import Video from "../models/Video";
import User from "../models/User";
import Comment from "../models/Comment";

export const home = async (req, res, next) => {
    try {
        const videos = await Video.find({}).sort({createdAt: "desc"}).populate("owner");
        res.render("home", { pageTitle: "Home", videos });
    } catch {
        return res.status(400).render("server-error");
    }
}

export const watch = async (req, res) => {
    const { id } = req.params;
    const video = await Video.findById(id).populate("owner").populate("comments");

    if (!video) {
        return res.status(404).render("404", { pageTitle: "Video not found." });
    }
    return res.render("videos/watch", { pageTitle: video.title, video });
}

// edit video
export const getEdit = async (req, res) => {
    const { id } = req.params;
    const {
        user: { _id }
    } = req.session;

    const video = await Video.findById(id);
    if (!video) {
        return res.status(404).render("404", { pageTitle: "Video not found." })
    }
    
    if (String(video.owner) !== String(_id)) {
        req.flash("error", "You are not the owner of the video");
        return res.status(403).redirect("/");
    }
    return res.render("videos/edit", { pageTitle: `Edit: ${video.title}`, video });
}

export const postEdit = async (req, res) => {
    const { id } = req.params;
    const { title, description, hashtags } = req.body;
    const video = await Video.exists({ _id: id });
    if (!video) {
        return res.status(404).render("404", { pageTitle: "Video not found." })
    }
    await Video.findByIdAndUpdate(id, {
        title,
        description,
        hashtags: Video.formatHashtags(hashtags)
    });
    req.flash("success", "Changes saved");
    return res.redirect(`/videos/${id}`);
}

// upload video
export const getUpload = (req, res) => {
    return res.render("videos/upload", { pageTitle: "Upload Video" });
}

export const postUpload = async (req, res) => {
    const { 
        session: { user: { _id } },
        files: { video, thumb },
        body: { title, description, hashtags }
    } = req;

    try {
        const newVideo = await Video.create({
            title,
            description,
            fileUrl: video[0].location,
            thumbUrl: thumb[0].location,
            owner: _id,
            hashtags: Video.formatHashtags(hashtags)
        });
        const user = await User.findById(_id);
        user.videos.push(newVideo._id);
        user.save();
    } catch(error) {
        return res.status(400).render("videos/upload", { pageTitle: "Upload Video", errorMessage: error._message });
    }
    return res.redirect("/");
}

export const deleteVideo = async (req, res) => {
    const { id } = req.params;
    const {
        user: { _id }
    } = req.session;

    const video = await Video.findById(id);
    if (!video) {
        return res.status(404).render("404", { pageTitle: "Video not found." })
    }

    if (String(video.owner) !== String(_id)) {
        return res.status(403).redirect("/");
    }
    await Video.findByIdAndDelete(id);
    return res.redirect("/");
};

export const search = async (req, res) => {
    const { keyword } = req.query;
    let videos = [];
    if (keyword) {
        videos = await Video.find({
            title: {
                $regex: new RegExp(keyword, "i")
            }
        }).populate("owner");
    }
    return res.render("videos/search", { pageTitle: "Search", videos });
}

// views api
export const registerView = async (req, res) => {
    const { id } = req.params;
    const video = await Video.findById(id);
    if (!video) {
        return res.sendStatus(404);
    }

    video.meta.views += 1;
    await video.save();
    return res.sendStatus(200);
};

// comment api
export const createComment = async (req, res) => {
    const { 
        params: { id },
        body: { text },
        session: { user }
    } = req;

    const video = await Video.findById(id);

    if (!video) {
        return res.sendStatus(404);
    }

    const comment = await Comment.create({
        text,
        owner: user._id,
        video: id
    });

    video.comments.push(comment._id);
    video.save();

    const userObj = await User.findById(user._id);
    if (!userObj) {
        return res.sendStatus(404);
    }

    userObj.comments.push(comment._id);
    userObj.save();

    // return res.sendStatus(201);
    return res.status(201).json({ newCommentId: comment._id });
}

export const deleteComment = async (req, res) => {
    const { id } = req.params;
    const userId = req.session.user._id;
    
    const comment = await Comment.findById(id);

    if (!comment) {
        return res.sendStatus(404);
    }

    if (!userId === String(comment.owner)) {
        return res.sendStatus(404);
    }
    
    await Comment.findByIdAndDelete(id);
    
    return res.sendStatus(200);
};