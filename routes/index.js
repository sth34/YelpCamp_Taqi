var express = require("express");
var router = express.Router();
var passport = require("passport")
var User = require("../models/user");
var Campground = require("../models/campground");

router.get("/", function(req, res){
	res.render("landing");
});

//AUTH ROUTES

router.get("/register", function(req, res){
	res.render("register", {page: 'register'});
});

//haldling sign up logic
router.post("/register", function(req, res){
	var newUser = new User({
			username: req.body.username, 
			email: req.body.email,
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			avatar: req.body.avatar
		});
	User.register(newUser, req.body.password, function(err, user){
		if (err) {
			// req.flash("error", err.message);
			return res.render("register", {error: err.message});
			
		}
			passport.authenticate("local")(req, res, function(){
			req.flash("success", "Welcome to YelpCamp " + user.username);
			res.redirect("/campgrounds");
		});
	});
});

//LOGIN Route
router.get("/login", function(req, res){
	res.render("login", {page: 'login'});
});

//haldling login logic
router.post("/login", passport.authenticate("local",
	{
		successRedirect: "/campgrounds",
		failureRedirect: "/login"
	}), function(req, res) {
				
});

//Logout logic
router.get("/logout", function(req, res){
	var loguser = req.user.username;
	req.logout();
	req.flash("success", loguser + " Successfully Logged Out!");
	res.redirect("/campgrounds");
});

// Profile route

router.get("/profile/:id", function(req, res){
		User.findById(req.params.id, function(err, foundUser) {
			if (err) {
				req.flash("error", "Something Went Wrong!");
				res.render("back")
			} 
				Campground.find().where("author.id").equals(foundUser._id).exec(function(err,campgrounds){
					if (err) {
						req.flash("error", "Something Went Wrong!");
						res.render("back")
					} 
						res.render("profile", {user: foundUser, campgrounds: campgrounds});
					
				});
		
		});

});

//function to stop unauthorized login to YelpCamp pages
function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}



//function to check ownership
function checkCampOwnership(req, res, next){
	if(req.isAuthenticated()){
		Campground.findById(req.params.id, function(err, foundCampground){
			if (err) {
				res.redirect("back");
			} else {
				
				if(foundCampground.author.id.equals(req.user._id)) {
					next();
				} else {
					res.redirect("back");
				}
			}
		});
	} else {
		res.redirect("back");
	
	}
}


module.exports = router;
