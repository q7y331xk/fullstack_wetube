import User from "../models/User";

export const getJoin = (req, res) => {
    return res.render("join", { pageTitle: "Join"});
};
export const postJoin = async(req, res) => {
    const { email, username, password, password2, name, location } = req.body;
    const pageTitle = "Join";
    if (password !== password2) {
        return res.render("join", {pageTitle, errorMessage: "Password confirmation does not match.",})
    }
    if(await User.exists({ username })){
        return res.render("join", {pageTitle, errorMessage: "This username is already taken.",})
    }
    if(await User.exists({ email })){
        return res.render("join", {pageTitle, errorMessage: "This email is already taken.",})
    }
    await User.create({
        email, username, password, name, location,
    });
    return res.redirect("/login");
}
export const edit = (req, res) => res.send("user edit");
export const remove = (req, res) => res.send("user delete");
export const login = (req,res) => res.send("user login");
export const logout = (req, res) => res.send("user logout");
export const profile = (req, res) => res.send("user profile");