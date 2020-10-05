const cookieSession = require("cookie-session");
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const app = express();
const session = require("express-session");
const passport = require("passport");
const MongoStore = require("connect-mongo")(session);
const cookieParser = require("cookie-parser"); // parse cookie header
const cors = require("cors");
const { ensureAuth } = require("./middleware/auth");
const path = require('path');
const mongoose = require("mongoose")

const connectDB = async(MONGO_URI) => {
    try {
        const conn = await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
        });


        console.log(`MongoDB Connected: ${conn.connection.host}`)

    } catch (e) {
        console.log(e);
        process.exit(1);
    }
}

// load config
dotenv.config({path: "./config/config.env"});

const MONGO_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.xaktw.mongodb.net/runningtracker?retryWrites=true&w=majority`

console.log(MONGO_URI);

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

connectDB(MONGO_URI);

// passport config
require("./passport.js")(passport);

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
