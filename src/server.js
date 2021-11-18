import express from "express";
import morgan from "morgan";
import session from "express-session";
import MongoStore from "connect-mongo";
import rootRouter from "./routers/rootRouter";
import usersRouter from "./routers/usersRouter";
import videoRouter from "./routers/videoRouter";
import { localsMiddleware } from "./middlewares";



const app = express();
const logger = morgan("dev");

app.set("view engine","pug");
app.set("views",process.cwd() + "/src/views");
app.use(logger);    // 얘가  요청 정보를 콘솔에 기록하는얘
app.use(express.urlencoded({extended: true}));
app.use(
    session({ 
        secret: process.env.COOKIE_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
        },
        store: MongoStore.create({ mongoUrl: process.env.DB_URL }),
    })
);

app.use(localsMiddleware);
app.use("/", rootRouter);
app.use("/videos", videoRouter);
app.use("/users",usersRouter);

export default app;

