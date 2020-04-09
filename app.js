var express = require("express"),
 	app = express(),
 	bodyParser = require ("body-parser"),
	mongoose = require("mongoose"),
	flash = require("connect-flash"),
	passport = require("passport"),
	LocalStrategy = require("passport-local"),
	methodOverride = require("method-override"),
 	Campground = require("./models/campground"),
 	Comment = require("./models/comment"),
 	User = require("./models/user");
// 	seedDB = require("./seeds"),

var reviewRoutes     = require("./routes/reviews"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes      = require("./routes/index")

mongoose.connect("mongodb+srv://taqi34:zartaq007@cluster0-m9ogm.mongodb.net/test?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology: true});
//mongoose.connect("mongodb://localhost/yelp_camp", {useNewUrlParser: true, useUnifiedTopology: true});
//mongodb+srv://taqi34:<password>@cluster0-m9ogm.mongodb.net/test?retryWrites=true&w=majority
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB();

//PASSPORT CONFIGURATONS
app.use(require("express-session")({
	secret: "My birth place is Hyderabad",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//passing the login user information to all routes
app.use(function(req,  res, next) {
	res.locals.currentUser = req.user;
	res.locals.success = req.flash("success");
	res.locals.error = req.flash("error");
	next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/reviews", reviewRoutes);


app.listen(3000, function(){
	console.log("YelpCamp Server Started!")

});

// RESTFUL ROUTES

// Name       	url      			verb       	description
// ===============================================================================	
// INDEX		/campgrounds		GET			Display a list of all Campgrounds
// NEW			/campgrounds/new	GET			Display Form to create new Campgrounds
// CREATE		/campgrounds		POST		Add new campgrounds to DB
// SHOW			/campgrounds/:id	GET			Show info about one campground
	