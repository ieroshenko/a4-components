const cookieSession = require("cookie-session");
const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const morgan = require("morgan");
const app = express();
const session = require("express-session");
const passport = require("passport");
const MongoStore = require("connect-mongo")(session);
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const cookieParser = require("cookie-parser"); // parse cookie header
const cors = require("cors");
const { ensureAuth } = require("./middleware/auth");
const path = require('path');

app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use(express.static(path.join(__dirname, './client/build')));

// setup cookie session
app.use(
    cookieSession({
        name: "session",
        keys: ["thisappisawesome"],
        maxAge: 24 * 60 * 60 * 100
    })
);

// parse cookies
app.use(cookieParser());

// morgan logging
app.use(morgan("dev"));

connectDB();

// load config
dotenv.config({path: "./config/config.env"});

// passport config
require("./config/passport.js")(passport);

const PORT = process.env.PORT;

// Sessions
app.use(
    session({
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: false,
        store: new MongoStore({mongooseConnection: mongoose.connection})
    })
)

// set up cors to allow us to accept requests from our client
app.use(
    cors({
        origin: "http://localhost:3000", // allow to server to accept request from different origin
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        credentials: true // allow session cookie from browser to pass through
    })
);

// Initializes passport and passport sessions
app.use(passport.initialize());
app.use(passport.session());

// routes
// app.use('/', require('./routes'));
app.use('/auth', require('./routes/auth'));
app.use('/api/runs', require('./routes/runs'));


app.get("/api/authCheck", ensureAuth, (req, res) => {
    res.status(200).json({
        authenticated: true,
        message: "user successfully authenticated",
        user: req.user,
        cookies: req.cookies
    });
});

app.get('*', (req,res) => {
    res.sendFile(path.join(__dirname, './client/build/index.html'));
});

// listen for requests :)
const listener = app.listen(PORT, () => {
    console.log("Your app is listening on port " + listener.address().port);
});
