export const trending = (req, res, next) => {
    res.render("home", {pageTitle: "Home"});
}
export const see = (req, res) => {
    // res.send(`Watch Video #${req.params.id}`);
    res.render("watch");
}
    
export const edit = (req, res) => {
    res.render("edit");
}
export const search = (req, res) => res.send("search");
export const upload = (req, res) => res.send("upload");
export const deleteVideo = (req, res) => {
    res.send("deleteVideo");
}