const express = require("express");
const app = express();
const env = require("./config/environment");
const port = env.express_server_port;
const expressLayouts = require("express-ejs-layouts");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const http = require("http");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const dotenv = require("dotenv").config();
const passport = require("passport");
const flash = require("connect-flash");
const session = require("express-session");
const sassMiddleware = require("node-sass-middleware");
// const passportGoogle = require("passport-google-oauth");
// const passportJWT = require("passport-jwt");
// const passportLocal = require("passport-local");
// const passportSpotify = require("passport-spotify");
const MongoStore = require("connect-mongo");
const route = require("./routes/index");

app.use(cors());
if (env.name == "development") {
app.use(
	sassMiddleware({
		src: path.join(__dirname, env.asset_path, "scss"),
		dest: path.join(__dirname, env.asset_path, "css"),
		debug: true,
		outputStyle: "extended",
		prefix: "/css",
	})
);
}
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(env.asset_path));
app.use("/uploads", express.static(__dirname + "/uploads"));
app.use(logger(env.morgan.mode, env.morgan.options));
app.use(expressLayouts);
app.set("layout extractStyles", true);
app.set("layout extractScripts", true);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
// app.use(
// 	session({
// 		//Cookie Name
// 		name: "spotifyclone",
// 		//Secret Key for encrypting the session cookie
//         //** TODO - Change the Secret Key before Deployment in Production Mode **//
// 		secret: env.session_cookie_key,
// 		//Don't save the uninitialized session
// 		saveUninitialized: false,
// 		//Dont re-save the session if it is not modified
// 		resave: false,
// 		//Cookie Options
// 		cookie: {
// 			//Cookie Expiry Time - 100 Minutes
// 			maxAge: 1000 * 60 * 100,
// 		},
//         //MongoStore is used to store the Session Cookies in the MongoDB
// 		store: MongoStore.create(
// 			{
// 				//DB Connection URL
// 				mongoUrl: `mongodb://localhost/${env.db}`,
//                 //Interacts with the mongoose to connect to the MongoDB
// 				mongooseConnection: db,
// 				//To auto remove the store
// 				autoRemove: "disabled",
// 			},
// 			(err) => {
// 				//If there is an error
// 				if (err) {
// console.log(err || "connect-mongodb setup ok");
// 				}
// 			}
// 		),
// 	})
// );
// app.use(passport.initialize());
// app.use(passport.session());
// app.use(passport.setAuthenticatedUser);
// app.use(flash());
// app.use(customMiddleware.setFlash);
app.use("/", route);

app.listen(port, (err) => {
	if (err) {
		console.log(err);
		return;
	}
	console.log(`Server is Up & Running Successfully on Port: ${port}`);
});
