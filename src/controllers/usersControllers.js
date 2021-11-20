import User from "../models/User";
import fetch from "node-fetch";
import bcrypt from "bcrypt";

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
};
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
    req.session.loggedIn = true;
    req.session.user = user;
    console.log("LOG USER IN! COMING SOON!");
    return res.redirect("/");
};
export const startGithubLogin = (req, res) => {
    const baseUrl = "https://github.com/login/oauth/authorize";
    const config = {
        client_id: process.env.GH_CLIENT_ID,
        allow_signup: false,
        scope: "read:user user:email",
    }
    const params = new  URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;
    return res.redirect(finalUrl);
};

export const finishGithubLogin = async (req, res) => {
    const baseUrl = "https://github.com/login/oauth/access_token";
    const config = {
        client_id: process.env.GH_CLIENT_ID,
        client_secret: process.env.GH_CLIENT_SECRET,
        code: req.query.code,
    };
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;
    const tokenRequest = await (
        await fetch(finalUrl, {
            method: "POST",
            headers: {
            Accept: "application/json",
            },
        })
    ).json();
    if ("access_token" in tokenRequest) {
        const {access_token} = tokenRequest;
        const apiUrl = "https://api.github.com";
        const userData = await (await fetch(`${apiUrl}/user`, {
            headers: {
                Authorization: `token ${access_token}`,
            }
        })).json();
        const emailData = await (await fetch(`${apiUrl}/user/emails`, {
            headers: {
                Authorization: `token ${access_token}`,
            },
        })
        ).json();
        const emailObj = emailData.find(
            (email) => (email.primary === true &&  email.verified === true
        ));
        if(!emailObj) {
            return res.redirect("/login");
        }
        const existingUser = await User.findOne({ email: emailObj.email });
        if (existingUser) {
            req.session.loggedIn = true;
            req.session.user = existingUser;
            return res.redirect("/");
        } else {
            const user = await User.create({
                name: userData.name ? userData.name : "Unknown",
                username: userData.login,
                email: emailObj.email,
                password: "",
                oauthOnly: true,
                location: userData.location,
            });
            req.session.loggedIn = true;
            req.session.user = user;
            return res.redirect("/");
        }
    } else {
    // error가 있을시 notification을 따로 보내고 싶음
        return res.redirect("/login");
    }
};
export const edit = (req, res) => res.send("user edit");
export const remove = (req, res) => res.send("user delete");
export const logout = (req, res) => res.send("user logout");
export const profile = (req, res) => res.send("user profile");