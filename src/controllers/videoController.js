import Video from "../models/Video";

// Video.find({}, (error, videos) => {
//     res.render("home", { pageTitle: "Home", videos });
// });

export const home = async (req, res, next) => {
    try {
        const videos = await Video.find({});
        res.render("home", { pageTitle: "Home", videos });
    } catch {
        return res.render("server-error");
    }
}
export const watch = async (req, res) => {
    const { id } = req.params;
    const video = await Video.findById(id);
    console.log(video);
    res.render("watch", { pageTitle: video.title, video });
}
    
export const getEdit = (req, res) => {
    const { id } = req.params;
    res.render("edit", { pageTitle: `Editng: ${video.title}` });
}
export const postEdit = (req, res) => {
    const { id } = req.params;
    const { title } = req.body;
    return res.redirect(`/videos/${id}`);
}

export const getUpload = (req, res) => {
    return res.render("upload", { pageTitle: "Upload Video" });
}

export const postUpload = async (req, res) => {
    const { title, description, hashtags } = req.body;
    try {
        await Video.create({
            title,
            description,
            hashtags: hashtags.split(",").map(word => `#${word}`)
        });
    } catch(error) {
        return res.render("upload", { pageTitle: "Upload Video", errorMessage: error._message });
    }
    return res.redirect("/");
}