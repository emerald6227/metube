import User from "../models/User";
import fetch from "node-fetch";
import bcrypt from "bcrypt";
import { checkSubscribed, getSubscribedCount } from "./subscribeController";

// Join
export const getJoin = (req, res) => res.render("users/join", { pageTitle: "Join" });

export const postJoin = async (req, res) => {
    const { name, username, email, password, password2, location } = req.body;
    const pageTitle = "Join";
    if (password !== password2) {
        req.flash("error", `비밀번호가 일치하지 않습니다.`);
        return res.status(400).render("users/join", { pageTitle }); 
    }

    const exists = await User.exists({ $or: [{username}, {email}] });
    if (exists) {
        req.flash("error", `아이디 혹은 이메일이 이미 존재합니다.`);
        return res.status(400).render("users/join", { pageTitle }); 
    }

    try {
        await User.create({
            name, username, email, password, location
        });
        return res.redirect("/login");
    } catch (error) {
        req.flash("error", `예기치 못한 에러가 발생했습니다.`);
        console.error(error);
        return res.status(400).render("users/join", { pageTitle });
    }
};

// Login
export const getLogin = (req, res) => { 
    res.render("users/login", { pageTitle: "Login" }); 
};

export const postLogin = async (req, res) => {
    const { username, password } = req.body;
    const pageTitle = "Login";

    const user = await User.findOne({ username, socialOnly: false });
    if (!user) {
        req.flash("error", `존재하지 않는 아이디입니다.`);
        return res.status(400).render("users/login", { pageTitle });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
        req.flash("error", `패스워드가 틀립니다.`);
        return res.status(400).render("users/login", { pageTitle });
    }

    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
};

// GitHub Login
export const startGithubLogin = (req, res) => {
    const baseUrl = `https://github.com/login/oauth/authorize`;
    const config = {
        client_id: process.env.GH_CLIENT || process.env.GH_CLIENT_TEST,
        scope: "read:user user:email"
    }

    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;
    return res.redirect(finalUrl);
};

export const finishGithubLogin = async (req, res) => {
    const baseUrl = "https://github.com/login/oauth/access_token";
    const config = {
        client_id: process.env.GH_CLIENT || process.env.GH_CLIENT_TEST,
        client_secret: process.env.GH_SECRET || process.env.GH_SECRET_TEST,
        code: req.query.code
    }

    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;

    // get access_token by code
    const tokenRequest = await (
        await fetch(finalUrl, {
            method: "POST",
            headers: {
                Accept: "application/json"
            }
        })
    ).json();

    // get userData, emailData
    if ("access_token" in tokenRequest) {
        const { access_token } = tokenRequest;
        const apiUrl = "https://api.github.com";
        const userData = await (
            await fetch(`${apiUrl}/user`, {
                headers: {
                    Authorization: `token ${access_token}`
                }
            })
        ).json();
        if(userData.location === null) {
            userData.location = "";
        }

        const emailData = await (
            await fetch(`${apiUrl}/user/emails`, {
                headers: {
                    Authorization: `token ${access_token}`
                }
            })
        ).json();
        
        // find verify email
        const emailObj = emailData.find((email) => email.primary === true && email.verified === true);
        if (!emailObj) {
            return res.redirect("/login");
        }

        // check User email
        let user = await User.findOne({email: emailObj.email});
        if (!user) {
            user = await User.create({
                avatarUrl: userData.avatar_url,
                name: userData.name,
                username: userData.login,
                email: emailObj.email,
                password: "",
                socialOnly: true,
                location: userData.location
            });
        }
        req.session.loggedIn = true;
        req.session.user = user;
        return res.redirect("/");
        
    } else {
        return res.redirect("/login");
    }
}

export const logout = (req, res) => {
    req.flash("info", "Bye Bye");
    req.session.destroy();
    return res.redirect("/");
};

// Edit profile
export const getEdit = (req, res) => {
    return res.render("users/edit-profile", { pageTitle: "Edit Profile" });
};

export const postEdit = async (req, res) => {
    const { 
        session: { 
            user: { _id, avatarUrl }},
        body: { name, email, username, location },
        file
    } = req;

    const isHeroku = process.env.NODE_ENV === "production";
    
    try {
        const updatedUser = await User.findByIdAndUpdate(_id, {
            avatarUrl: file ? (isHeroku ? file.location : file.path) : avatarUrl,
            name,
            email,
            location
            },
            { new: true }
        );

        req.session.user = updatedUser;
    } catch(error) {
        console.error(error);
    }

    return res.redirect("/users/edit");
}

export const postEditErrorHandler = (err, req, res, next) => {
    if (err) {
        if (req.file === undefined) {
            req.flash("error", `이미지 용량이 너무 큽니다. 이미지 용량은 1MB를 넘을 수 없습니다.`);
            return res.status(500).render("users/edit-profile", { pageTitle: "Edit Profile" });
        }
    }
    next();
};

// Change Password
export const getChangePassword = (req, res) => {
    if (req.session.user.socialOnly === true) {
        req.flash("error", "Can't change password. you already have social account");
        return res.redirect("/");
    } 
    return res.render("users/change-password", { pageTitle: "Change Password" });
}

export const postChangePassword = async (req, res) => {
    // send notification
    const { 
        session: {
            user: { _id }
        },
        body: { oldPassword, newPassword, newPassword2 }
    } = req;

    if (newPassword !== newPassword2) {
        req.flash("error", `새로운 비밀번호가 일치하지 않습니다.`);
        return res.status(400).render("users/change-password", { pageTitle: "Change Password" });
    }

    const user = await User.findById(_id);
    const ok = await bcrypt.compare(oldPassword, user.password);
    if(!ok) {
        req.flash("error", `현재 비밀번호가 일치하지 않습니다.`);
        return res.status(400).render("users/change-password", { pageTitle: "Change Password" });
    }

    user.password = newPassword;
    await user.save();

    req.flash("info", "Password updated");
    return res.redirect("/users/logout");
}

// user profile
export const seeProfile = async (req, res) => {
    const { 
        params: { id },
        session: { user }
    } = req;

    const ownerUser = await User.findById(id).populate({
        path: "videos",
        populate: {
            path: "owner",
            model: "User"
        }
    });

    if (!ownerUser) {
        return res.status(404).render("404", { pageTitle: "User not found."});
    }

    let subscribed = false;
    let subscribedCount = 0;
    if (user) {
        try {
            subscribed = await checkSubscribed(id, user._id);
        } catch (error) {
            console.error(error);
        }
    }
    subscribedCount = await getSubscribedCount(id);

    return res.render("users/profile", { pageTitle: `${ownerUser.name}의 Profile` , ownerUser, subscribed, subscribedCount });
};

// user Delete
export const getDelete = async (req, res) => {
    const user = req.session.user;

    await User.findByIdAndDelete(user._id);
    req.flash("info", "Account delete complete");
    req.session.destroy();

    return res.redirect("/");
};