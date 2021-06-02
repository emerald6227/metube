const videos = [
    {
        title: "First Video",
        rating: 5,
        comments: 2,
        createdAt: "2 minutes ago",
        views: 59,
        id: 1
    },
    {
        title: "Second Video",
        rating: 5,
        comments: 2,
        createdAt: "2 minutes ago",
        views: 59,
        id: 1
    },
    {
        title: "Third Video",
        rating: 5,
        comments: 2,
        createdAt: "2 minutes ago",
        views: 59,
        id: 1
    }
]
export const trending = (req, res, next) => {
    // const videos = [1, 2, 3, 4, 5, 6, 7, 8 ,9 ,10];
    res.render("home", {pageTitle: "Home", videos});
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