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
    const user = await User.findOne({ username, oauthOnly: false });
    if (!user) {
        return res.status(400).render("login", {pageTitle, errorMessage: "An account with this username dose not exist."})
    }
    const matchPassword = await bcrypt.compare(password, user.password);
    if (!matchPassword) {
        return res.status(400).render("login", {pageTitle, errorMessage: "Password does not match"})
    }
    req.session.loggedIn = true;
    req.session.user = user;
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
            // set notification (로그인 안되는 이유)
            return res.redirect("/login");
        }
        let user = await User.findOne({ email: emailObj.email });
        if (!user) {
                user = await User.create({
                name: userData.name ? userData.name : "Unknown",
                avatarUrl: userData.avatarUrl ? userData.avatarUrl : "",
                username: userData.login,
                email: emailObj.email,
                password: "",
                oauthOnly: true,
                location: userData.location,
            });
            // 이 결과 부족한게 있으면 채워넣는 페이지가 보통 있는듯
        }
        req.session.loggedIn = true;
        req.session.user = user;
        return res.redirect("/");
    } else {
    // error가 있을시 notification을 따로 보내고 싶음
        return res.redirect("/login");
    }
};
export const getEdit = (req, res) => {
    return res.render("edit-profile", {
        pageTitle: "Edit Profile",
    });
};

export const postEdit = async (req, res) => {
    const {
        body: { name, location },
        session: { user: { _id }, },
        file 
        } = req;
    if (name === req.session.user.name && location === req.session.user.location && file.path === req.session.user.avatarUrl) 
        return res.status(400).render("edit-profile", { pageTitle: "Edit Profile", errorMessage: "There is no difference"}) 
    const newUser = await User.findByIdAndUpdate(
        _id,
        { name, location, avatarUrl: file ? file.path : req.session.user.avatarUrl},
        { new: true },
    );
    req.session.user = newUser;
    return res.redirect("/users/edit");
};

export const getChangePassword = (req, res) => {
    return res.render("change-password", { pageTitle: "Change Password" });
};
export const postChangePassword = async (req, res) => {
    const {
        session: { user: { 
            _id, password
        }, },
        body: {
            oldPassword,
            newPassword,
            confirmPassword,
        },
    } = req;
    if (newPassword !== confirmPassword) {
        return res.status(400).render("change-password",  {
            pageTitle: "change Password",
            errorMessage: "New Password does not match",
        })
    }
    const checkOldPassword = await bcrypt.compare(oldPassword, password);
    if (!checkOldPassword) {
        return res.status(400).render("change-password",  {
            pageTitle: "change Password",
            errorMessage: "Old password is not correct",
        })
    }
    const user = await User.findById(_id);
    user.password = newPassword;
    await user.save();
    req.session.user.password = user.password;
    // send notification "You changed Password"
    return res.redirect("/users/logout");
};


export const remove = (req, res) => res.send("user delete");
export const logout = (req, res) => {
    req.session.destroy();
    return res.redirect("/");
}
export const profile = (req, res) => res.send("user profile");