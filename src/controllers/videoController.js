export const trending = (req, res, next) => res.send("Home Page Videos");
export const see = (req, res) => {
    res.send(`Watch Video #${req.params.id}`);
}
    
export const edit = (req, res) => {
    res.send("Edit Video");
}
export const search = (req, res) => res.send("search");
export const upload = (req, res) => res.send("upload");
export const deleteVideo = (req, res) => {
    res.send("deleteVideo");
}