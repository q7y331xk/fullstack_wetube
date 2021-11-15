import User from "../models/User";
import bcrypt from "bcrypt"

export const getJoin = (req, res) => {
    return res.render("join", { pageTitle: "Join"});
};
export const postJoin = async(req, res) => {
    const { email, username, password, password2, name, location } = req.body;
    const pageTitle = "Join";
    if (password !== password2) {
        return res.status(400).render("join", {pageTitle, errorMessage: "Password confirmation does not match.",})
    }
    if(await User.exists({ username })){
        return res.status(400).render("join", {pageTitle, errorMessage: "This username is already taken.",})
    }
    if(await User.exists({ email })){
        return res.status(400).render("join", {pageTitle, errorMessage: "This email is already taken.",})
    }
    try {
        await User.create({
            email, username, password, name, location,
        });
    } catch(error) {
        return res.status(400).render("join", { pageTitle: "Create account fail" });
    }
    return res.redirect("/login");
}
export const getLogin = (req,res) => res.render("login", {pageTitle: "Login page"});
export const postLogin = async (req,res) => {
    const {username, password} = req.body;
    const pageTitle = "Login";
    const user = await User.findOne({ username });
    if (!user) {
        return res.status(400).render("login", {pageTitle, errorMessage: "An account with this username dose not exist."})
    }
    console.log(user.password);
    const matchPassword = await bcrypt.compare(password, user.password);
    if (!matchPassword) {
        return res.status(400).render("login", {pageTitle, errorMessage: "Password does not match"})
    }
    console.log("LOG USER IN! COMING SOON!");
    return res.redirect("/");
}
export const edit = (req, res) => res.send("user edit");
export const remove = (req, res) => res.send("user delete");
export const logout = (req, res) => res.send("user logout");
export const profile = (req, res) => res.send("user profile");