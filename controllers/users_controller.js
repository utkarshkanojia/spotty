const { validationResult } = require("express-validator");
const User = require("../models/user");
const Genre = require("../models/genre");
const GenreUserRelation = require("../models/genreUserRelation");
const fs = require("fs");
const path = require("path");

module.exports.share = (req, res) => {};

module.exports.library = (req, res) => {
	return res.render("user_library", {
		title: "Your Library",
	});
};

module.exports.likedSongs = (req, res) => {
	return res.render("liked_songs", {
		title: "Liked Songs",
	});
};

module.exports.profile = async (req, res) => {
	try {
		const id = req.params.id;
		const user = await User.findById(id).select("-password -__v");
		const users = await User.find({});
		return res.render("user_profile", {
			title: "Profile",
			profile_user: user,
			all_users: users,
		});
	} catch (error) {
		console.log("Error in fetching the user profile !!!");
		req.flash("error", "Error in fetching the user profile !!!");
		return res.redirect("back");
	}
};

module.exports.update = async (req, res) => {
	if (req.params.id == req.user.id) {
		try {
			let user = await User.findById(req.params.id);
			User.uploadedAvatar(req, res, (err) => {
				if (err) {
					console.log("Error in Multer: ", err);
					return res.redirect("back");
				}

				user.name = req.body.name;
				user.email = req.body.email;
				user.password = req.body.password;

				if (req.file) {
					if (user.avatar) {
						if (fs.existsSync(path.join(__dirname, "..", user.avatar))) {
							fs.unlinkSync(path.join(__dirname, "..", user.avatar));
						}
					}
					user.avatar = User.avatarPath + "/" + req.file.filename;
				}

				user.save();
				req.flash("success", "Profile Updated !!!");
				return res.redirect("back");
			});
		} catch (error) {
			req.flash("error", "Error in updating the Profile!");
			return res.redirect("back");
		}
	} else {
		req.flash("error", "Unauthorized Access!");
		return res.redirect("back");
	}
};

module.exports.login = (req, res) => {
	if (req.isAuthenticated()) {
		return res.redirect("/");
	}
	return res.render("user_sign_in", {
		title: "Login",
	});
};

module.exports.signup = (req, res) => {
	if (req.isAuthenticated()) {
		return res.redirect("/");
	}
	return res.render("user_sign_up", {
		title: "Sign Up",
	});
};

module.exports.recommendations = async (req, res) => {
	try {
		let user = await User.findById(req.user.id);
		for (let key in req.query) {
			let genre = await Genre.findById(req.query[key]);
			let genreUserRelation = await GenreUserRelation.create({
				genre: genre._id,
				user: user._id,
			});
			await user.genreUserRelations.push(genreUserRelation);
			await genre.genreUserRelations.push(genreUserRelation);
			await user.save();
			await genre.save();
		}
		req.flash("success", "Logged In Successfully !!!");
		return res.redirect("/");
	} catch (error) {
		req.flash("error", "Error in Logging in !!!");
		return res.redirect("/users/logout");
	}
};

module.exports.createSession = async (req, res) => {
	// req.session.playlists = req.body.playlists;
	// req.body = {};
	try {
		let genres = await Genre.find({});
		if (
			req.user.genreUserRelations.length === 0 ||
			req.user.genreUserRelations === undefined
		) {
			return res.render("recommendations", {
				title: "Music Preferences",
				all_genres: genres,
			});
		}
		req.flash("success", "Logged In Successfully !!!");
		return res.redirect("/");
	} catch (error) {
		console.log("Error in creating the session !!!");
		req.flash("error", "Error in creating the session !!!");
		return res.redirect("back");
	}
};

module.exports.destroySession = (req, res) => {
	req.logout((err) => {
		if (err) {
			return next(err);
		}
		req.flash("success", "Logged Out Successfully !!!");
		return res.redirect("/");
	});
};

module.exports.createUser = async (req, res) => {
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			const error = errors.array();
			console.log(error[0].msg);
			return res.redirect("back");
		}

		if (req.body.password !== req.body.confirm_password) {
			console.log("Password didn't match !!!");
			// req.flash("error", "Password didn't match !!!");
			return res.redirect("back");
		}

		const user = await User.findOne({ email: req.body.email });
		if (user) {
			console.log("Email already exists !!!");
			// req.flash("error", "Email already exists !!!");
			return res.redirect("back");
		}

		let newUser = await User.create(req.body);
		newUser.avatar =
			"https://raw.githubusercontent.com/Ayush-Kanduri/Social-Book_Social_Media_Website/master/assets/images/empty-avatar.png";
		console.log("Signed Up Successfully !!!");
		// req.flash("success", "Signed Up Successfully !!!");
		return res.redirect("/users/login");
	} catch (error) {
		console.log("Error in creating the user !!!");
		// req.flash("error", "Error in creating the user !!!");
		return res.redirect("back");
	}
};
