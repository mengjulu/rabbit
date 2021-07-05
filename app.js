const express = require("express");
const app = express();
const ejs = require("ejs");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const flash = require("connect-flash");
const multer = require("multer");
require("dotenv").config();

//configuration
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use("/static", express.static("public"));
app.set("view engine", "ejs");

app.use(flash());

// passport config
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: "mongodb+srv://mengjulu:test@cluster.plial.mongodb.net/rabbitDB?retryWrites=true&w=majority"
    }),
    cookie: {
        maxAge: 8640000
    }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});

//multer config for file upload 
const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/image/subImage")
    },
    filename: (req, file, cb) => {
        const subName = req.body.subName;
        const filetype = file.mimetype === "image/png" ? ".png" :
        file.mimetype === "image/jpeg" ? ".jpeg" :
        file.mimetype === "image/svg+xml" ? ".svg" :
        ".jpeg";
        cb(null, subName + filetype)
    }
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype === "image/png" || file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg" || file.mimetype === "image/svg+xml") {
        cb(null, true);
    } else {
        cb(null, false);
    }
};
app.use(multer({storage: fileStorage, fileFilter: fileFilter}).single("subImg"));

//api config
const authRoute = require("./routes/auth");
const mainPageRoute = require("./routes/mainPage");
const postRoute = require("./routes/post");
const commentRoute = require("./routes/comment");
const subforumRoute = require("./routes/subforum");
const userRoute = require("./routes/user");

app.use(authRoute);
app.use(mainPageRoute);
app.use(postRoute);
app.use(commentRoute);
app.use("/r", subforumRoute);
app.use("/user", userRoute);

const errorController = require("./controllers/errorController");
app.use(errorController.getErr);

app.listen(process.env.PORT || 3000, (req, res)=> {
    console.log("Successfully logged in.")
});