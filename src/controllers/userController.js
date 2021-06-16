import User from "../models/User";
import fetch from "node-fetch";
import bcrypt from "bcrypt";

// Join
export const getJoin = (req, res) => res.render("users/join", { pageTitle: "Join" });

export const postJoin = async (req, res) => {
    const { name, username, email, password, password2, location } = req.body;
    const pageTitle = "Join";
    if (password !== password2) {
        return res.status(400).render("users/join", { pageTitle, errorMessage: "Password confirmation does not match." }); 
    }

    const exists = await User.exists({ $or: [{username}, {email}] });
    if (exists) {
        return res.status(400).render("users/join", { pageTitle, errorMessage: "This username/email is already taken." }); 
    }

    try {
        await User.create({
            name, username, email, password, location
        });
        return res.redirect("/login");
    } catch (error) {
        return res.status(400).render("users/join", { pageTitle, errorMessage: error._message });
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
        return res.status(400).render("users/login", { pageTitle, errorMessage: "An account with this username does not exists." });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
        return res.status(400).render("users/login", { pageTitle, errorMessage: "Wrong password." });
    }

    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
};

// GitHub Login
export const startGithubLogin = (req, res) => {
    const baseUrl = `https://github.com/login/oauth/authorize`;
    const config = {
        client_id: process.env.GH_CLIENT,
        scope: "read:user user:email"
    }

    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;
    return res.redirect(finalUrl);
};

export const finishGithubLogin = async (req, res) => {
    const baseUrl = "https://github.com/login/oauth/access_token";
    const config = {
        client_id: process.env.GH_CLIENT,
        client_secret: process.env.GH_SECRET,
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

    // const exists = await User.exists({ $or: [{username}, {email}] });
    // if (exists) {
    //     return res.status(400).render("users/edit-profile", { pageTitle: "Edit Profile", errorMessage: "This username/email is already taken." }); 
    // }
    
    try {
        const updatedUser = await User.findByIdAndUpdate(_id, {
            avatarUrl: file ? file.path : avatarUrl,
            name,
            email,
            username,
            location
            },
            { new: true }
        );

        req.session.user = updatedUser;
    } catch(error) {
        console.log(error);
    }

    return res.redirect("/users/edit");
}

// Change Password
export const getChangePassword = (req, res) => {
    if (req.session.user.socialOnly === true) {
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
        return res.status(400).render("users/change-password", { pageTitle: "Change Password", errorMessage: "The New Password does not match the confirmation." });
    }

    const user = await User.findById(_id);
    const ok = await bcrypt.compare(oldPassword, user.password);
    if(!ok) {
        return res.status(400).render("users/change-password", { pageTitle: "Change Password", errorMessage: "The Current Password is incorrect." });
    }

    user.password = newPassword;
    await user.save();

    return res.redirect("/users/logout");
}

export const see = (req, res) => res.send("see");