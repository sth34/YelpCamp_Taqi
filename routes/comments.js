var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//  New comment

router.get("/cnew",middleware.isLoggedIn, function(req, res){
	
	//Find the campground and post comments
	Campground.findById(req.params.id, function(err, campground){
		if (err) {
			console.log(err);
			
		} else {
			res.render("cnew", {campground: campground});
		}
	});
	
});

// Create comment

router.post("/",middleware.isLoggedIn, function(req, res){
	//Find the campground
	//Create comments for the campground
	//Connect new comment to campground
	//Reddirect to show page
	Campground.findById(req.params.id, function(err, campground){
		if (err) {
			console.log(err);
			
		} else {
			Comment.create(req.body.comment, function(err, comment){
				if (err) {
					console.log(err);
					
				} else {
					//pass comment data to user data (long user will comment)
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save() // save comment
					campground.comments.push(comment);
					campground.save();
					res.redirect("/campgrounds/" + campground._id);
				}
			});
		}
	});
	
});

//Edit comment 

router.get("/:comment_id/edit",middleware.checkCommentOwnership, function(req, res){
		Comment.findById(req.params.comment_id, function(err, foundComment){
			if (err) {
				res.redirect("back");
			} else {
				
			}
				res.render("cedit", {comment: foundComment, campground_id: req.params.id});
		});
	
});

// Update comment

router.put("/:comment_id",middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
		if (err) {
			res.redirect("back");
		} else {
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
	
});
// Delete comment

router.delete("/:comment_id",middleware.checkCommentOwnership, function(req, res){
	//Find by Id and delete
		Comment.findByIdAndDelete(req.params.comment_id, function(err){
		if (err) {
			res.redirect("back");
				
		} else {
			res.redirect("/campgrounds/" + req.params.id);
		}		
	});
});


//function to stop unauthorized login to YelpCamp pages
// function isLoggedIn(req, res, next){
// 	if(req.isAuthenticated()){
// 		return next();
// 	}
// 	res.redirect("/login");
// }

//function to check ownership
// function checkCommentOwnership(req, res, next){
// 	if(req.isAuthenticated()){
// 		Comment.findById(req.params.comment_id, function(err, foundComment){
// 			if (err) {
// 				res.redirect("back");
// 			} else {
				
// 				if(foundComment.author.id.equals(req.user._id)) {
// 					next();
// 				} else {
// 					res.redirect("back");
// 				}
// 			}
// 		});
// 	} else {
// 		res.redirect("back");
	
// 	}
// }

module.exports = router;
