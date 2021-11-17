export const localsMiddleware = (req, res, next) => {
    console.log("in local middleware ", req.session);
    res.locals.siteName = "Wetube";
    res.locals.loggedIn = Boolean(req.session.loggedIn);
    res.locals.loggedInUser = req.session.user;
    console.log("\n", res.locals);
    next();
};