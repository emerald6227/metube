export const localsMiddleware = (req, res, next) => {
    res.locals.loggedIn = Boolean(req.session.loggedIn);
    res.locals.siteNmae="Metube";
    res.locals.loggedInUser = req.session.user;
    // console.log("locals데이터: ", res.locals);
    next();
};