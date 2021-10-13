import express from "express";
import morgan from "morgan";
import globalRouter from "./routers/globalRouter";
import usersRouter from "./routers/usersRouter";
import videoRouter from "./routers/videoRouter";



const PORT = 4000;

const app = express();
const logger = morgan("dev");

app.use(logger);

app.use("/", globalRouter);
app.use("/videos", videoRouter);
app.use("/users",usersRouter);

const handleListening = () => {
    console.log(`❗Server listening on port http://localhost:${PORT}🚀`);
}

const home = (req, res) => {
    console.log("I will respond.");
    res.send(`You are useing ${PORT} to go ${req.url}`);
};
const login = (req, res) => {
    return res.send("login");
}

app.listen(PORT, handleListening);