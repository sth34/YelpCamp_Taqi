var mongoose = require ("mongoose");
var Campground = require ("./modules/campground");
var Comment = require ("./modules/comment");

var Data = [
	
	{
		name: "Mountain River", 
		image: "https://image.shutterstock.com/image-photo/camping-tent-near-mountain-river-600w-538634797.jpg",
		description: "A very beautiful view of river flowing down the mountain side nice place to hang around with friends and family members."	
	
	},
	{
		name: "Granite Hills", 
		image: "https://image.shutterstock.com/image-photo/tourist-bonfire-tent-autumn-forest-600w-519338524.jpg",
		description: "This is a beautiful campground under the sky with bonfire lighting around"	
	
	},
	{
		name: "Milky Way Camp", 
		image: "https://image.shutterstock.com/image-photo/night-camping-on-shore-man-600w-1220854264.jpg",
		description: "Night camping on shore. Man and woman hikers having a rest in front of tent at campfire under evening sky full of stars and Milky way on blue water and forest background. Outdoor lifestyle concept."	
	
	}
]

function seedDB(){
	//Remove all campgrounds
	Campground.remove({}, function(err,removedCampgrounds){
		if (err) {
			console.log(err);

		} else {
			console.log("Campgrounds Removed Successful")
			//Add new campgrounds
			Data.forEach(function(seed) {
				Campground.create (seed, function(err, campground){
					if (err) {
						console.log(err);

					} else {
						console.log("Campground Added!");
						//Create comment
						Comment.create(
							{
							text: "This place is good, but I wish having Internet!",
							author: "Homer"
						}, function(err, comment){
							if (err) {
								console.log(err);
							} else {
								campground.comments.push(comment);
								campground.save();
								console.log("comment created");
							}
						});

					}
				});
			});
		}
	});
	
	

//Add Comments
}

module.exports = seedDB;

