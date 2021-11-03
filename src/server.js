
import express from "express";
import morgan from "morgan";
import rootRouter from "./routers/rootRouter";
import usersRouter from "./routers/usersRouter";
import videoRouter from "./routers/videoRouter";


const app = express();
const logger = morgan("dev");

app.set("view engine","pug");
app.set("views",process.cwd() + "/src/views");
app.use(logger);    // 얘가  요청 정보를 콘솔에 기록하는얘
app.use(express.urlencoded({extended: true}));
app.use("/", rootRouter);
app.use("/videos", videoRouter);
app.use("/users",usersRouter);

/*
const home = (req, res) => {
    console.log("I will respond.");
    res.send(`You are useing ${PORT} to go ${req.url}`);
};
const login = (req, res) => {
    return res.send("login");
}
*/

export default app;