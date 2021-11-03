export const getJoin = (req, res) => {
    return res.render("join", { pageTitle: "Join"});
};
export const postJoin = (req, res) => {
    console.log(req.body);
    res.end();
}
export const edit = (req, res) => res.send("user edit");
export const remove = (req, res) => res.send("user delete");
export const login = (req,res) => res.send("user login");
export const logout = (req, res) => res.send("user logout");
export const profile = (req, res) => res.send("user profile");