//Create express app
const express = require('express');
let app = express();

//Database variables
let mongo = require('mongodb');
let MongoClient = mongo.MongoClient;
let db;

const session = require('express-session');


//Place to store log in information
let loginInfo = {};

//View engine
app.set("view engine", "pug");

app.use(express.json());
app.use(express.urlencoded({extended: true}));

//Setting up session
app.use(session({
    secret: 'Bleebloopo',
    resave: true,
    saveUninitialized: true
}));



//Set up the routes
app.use(express.static("public"));
//Routes for home page, making account, and logging in
app.get("/", sendHomePage);
app.get("/makeAccount", sendMakeAccountPage);
app.get("/logIn", sendLogInPage);

//Routes for logging in
app.post("/loginInfo", updateLoginInfo);
app.post("/logUserIn", logUserIn);

//Routes to switch roles and log out
app.put("/becomeArtist", becomeAnArtist);
app.put("/becomePatron", becomeAPatron)
app.put("/logOut", logUserOut);

//Routes to search for artworks and individual artworks
app.get("/searchArtWorks", sendSearchPage);
app.get("/artWorks", sendArtWorks);
app.get("/artWork/:artID", sendArtWork);

//Routes to get, edit, and delete likes and reviews
app.get("/getLikes/:artID", getLikes);
app.put("/setLikesP/:artID", setLikesPlus);
app.put("/setLikes-/:artID", setLikesMinus);
app.put("/addReview/:artID", addReview);

//Route to get an artist page
app.get("/artist/:artistName", getArtist);

//Route to add art works and workshops
app.get("/addArtWorks", addArtWorkPage);
app.post("/addArtWork", addArtWork);
app.get("/addWorkShop", addWorkShopPage);
app.post("/addWorkShop", addWorkShop)

//Route to view user profile
app.get("/userProfile", userProfilePage);

//Routes to follow or unfollow artists
app.put("/followArtist/:artistName", followArtist);
app.put("/unfollowArtist/:artistName", unfollowArtist);

//Route to navigate to the matching medium and category pages
app.get("/medium/:theMediums", getMediums);
app.get("/category/:theCategories", getCategories);

//Route to tell the client whether this user liked that picture or not
app.get("/like/:artID", didILike);






//Sending home page
function sendHomePage(req, res, next){

	res.render("homepage", {});
	next();
	
}

//Sending make account page
function sendMakeAccountPage(req, res, next){

	res.render("makeaccount", {});
	next();

}

//Sending log in page
function sendLogInPage(req, res, next){

	res.render("login", {});
	next();

}

//Updating log in info on server, it was said by the prof on discord that this was allowed
function updateLoginInfo(req, res, next){
	let lInfo = req.body;

	let username = lInfo[0];
	let password = lInfo[1];

	//console.log(lInfo);

	if(loginInfo.hasOwnProperty(username) === false){
		loginInfo[username] = {};
		loginInfo[username].password = password;
		loginInfo[username].loggedIn = false;
		loginInfo[username].artist = false;
		loginInfo[username].following = [];
		loginInfo[username].notifications = [];
		loginInfo[username].liked = {};
		loginInfo[username].reviewed = {};
		res.send(JSON.stringify(true));
	}
	else{
		res.send(JSON.stringify(false));
	}
	
	next();
}

//Logging the user in
function logUserIn(req, res, next){
	let lInfo = req.body;

	let username = lInfo[0];
	let password = lInfo[1];

	if(loginInfo.hasOwnProperty(username) === true){
		if(loginInfo[username].password === password){
			loginInfo[username].loggedIn = true;
			req.session.user = username;
			
			res.send(JSON.stringify(true));
		}
		else{
			res.send(JSON.stringify(false));
		}
		
	}
	else{
		res.send(JSON.stringify(false));
	}
	next();
}

//Making the user into an artist
function becomeAnArtist(req, res, next){
	if(loginInfo.hasOwnProperty(req.session.user)){
		if(loginInfo[req.session.user].artist === true){
			res.send();
		}
		else{
			let artistObj = {};
			artistObj.artist = req.session.user;
			artistObj.workShops = [];
			db.collection("artists").findOne({artist: artistObj.artist}, function(err, result){
				if(err){
					res.status(500).send("Error reading database.");
					return;
				}
				if(!result){
					db.collection("artists").insertOne(artistObj, function(err, result){
						if(err){
							res.status(500).send("Error reading database.");
							return;
						}
						if(!result){
							res.status(404).send("Unknown ID");
							return;
						}
						
					});
				}
				
			});
			

			loginInfo[req.session.user].artist = true;
			res.send(JSON.stringify(true));
		}
		
	}
	else{
		res.send(JSON.stringify(false));
	}
	next();
	
}

//Making the user into a patron
function becomeAPatron(req, res, next){
	if(loginInfo.hasOwnProperty(req.session.user)){
		if(loginInfo[req.session.user].artist === false){
			res.send();
		}
		else{
			loginInfo[req.session.user].artist = false;
			res.send(JSON.stringify(true));
		}
		
	}
	else{
		res.send(JSON.stringify(false));
	}
	next();
	
}

//Logging the user out
function logUserOut(req, res, next){
	if(loginInfo.hasOwnProperty(req.session.user)){
		loginInfo[req.session.user].loggedIn = false;
		req.session.user = null;
		res.send(JSON.stringify(true));
		
	}
	else{
		res.send(JSON.stringify(false));
	}
	next();
	

}


//Sending the search page
function sendSearchPage(req, res, next){
	if(loginInfo.hasOwnProperty(req.session.user) && loginInfo[req.session.user].loggedIn === true){
		res.render("searchart", {});
	}
	else{
		res.render("notloggedin", {});
	}
	
	next();
}



//Sending the artworks found by the search
function sendArtWorks(req, res, next){
	let artistVal = req.query.artist;
	let nameVal = req.query.name;
	let keywordVal = req.query.keyword;





	db.collection("arts").find({artist: {"$regex" : ".*" + artistVal + ".*", "$options": "i"}, name: {"$regex" : ".*" + nameVal + ".*", "$options": "i"}, category: {"$regex" : ".*" + keywordVal + ".*", "$options": "i"}}).toArray(function(err,result){
		if(err) throw err;

		let artWorks = result;

		res.render("artworks",{artWorks:artWorks});
	});

	
}

//Sending the individual artwork whose link has been clicked
function sendArtWork(req, res, next){
	let oid;

	try{
		oid = new mongo.ObjectId(req.params.artID);
	}catch{
		res.status(404).send("Unknown ID");
		return;
	}

	db.collection("arts").findOne({"_id":oid}, function(err, result){
		if(err){
			res.status(500).send("Error reading database.");
			return;
		}
		if(!result){
			res.status(404).send("Unknown ID");
			return;
		}

		if(result.hasOwnProperty('reviews') === false){
			result.reviews = [];
		}

		res.format({
			"text/html": () =>{
				res.status(200).render("artwork", result);
			},
			"application/json": () =>{
				let thisObj = result;
				
	
				res.json(thisObj);
			}
		});
		
		
	});
}

//Getting how many likes the picture currently has
function getLikes(req, res, next){
	let oid;

	try{
		oid = new mongo.ObjectId(req.params.artID);
	}catch{
		res.status(404).send("Unknown ID");
		return;
	}

	db.collection("arts").findOne({"_id":oid}, function(err, result){
		if(err){
			res.status(500).send("Error reading database.");
			return;
		}
		if(!result){
			res.status(404).send("Unknown ID");
			return;
		}

		let thisObj = result;

		if(thisObj.hasOwnProperty("likes")){
			res.json(thisObj.likes);
		}
		else{
			db.collection("arts").updateOne({"_id":oid},{$set: {likes: 0}}, function(err,result){
				if(err) throw err;
			});
			thisObj.likes = 0;
			res.json(thisObj.likes);
		}
				
	});

}

//Increasing the number of likes this picture has by 1
function setLikesPlus(req, res, next){
	let oid;
	

	try{
		oid = new mongo.ObjectId(req.params.artID);
	}catch{
		res.status(404).send("Unknown ID");
		return;
	}

	db.collection("arts").findOne({"_id":oid}, function(err, result){
		if(err){
			res.status(500).send("Error reading database.");
			return;
		}
		if(!result){
			res.status(404).send("Unknown ID");
			return;
		}

		let thisObj = result;

	
	

		if(thisObj.hasOwnProperty("likes")){
			db.collection("arts").updateOne({"_id":oid},{$set: {likes: thisObj.likes+1}}, function(err,result){
				if(err) throw err;
			});
			//let myObj = {};
			//myObj[thisObj.name] = oid;

			//console.log(myObj);

			loginInfo[req.session.user].liked[thisObj.name] = oid;
			
			thisObj.likes++;
			res.json(thisObj.likes);
		}
		else{
			res.status(404).send("Unknown ID");
		}
				
	});
}

//Decreasing the number of likes this picture has by 1
function setLikesMinus(req, res, next){
	let oid;
	

	try{
		oid = new mongo.ObjectId(req.params.artID);
	}catch{
		res.status(404).send("Unknown ID");
		return;
	}

	db.collection("arts").findOne({"_id":oid}, function(err, result){
		if(err){
			res.status(500).send("Error reading database.");
			return;
		}
		if(!result){
			res.status(404).send("Unknown ID");
			return;
		}

		let thisObj = result;


		

		if(thisObj.hasOwnProperty("likes")){
			db.collection("arts").updateOne({"_id":oid},{$set: {likes: thisObj.likes-1}}, function(err,result){
				if(err) throw err;
			});

			//let myObj = {};
			//myObj[thisObj.name] = oid;
			//console.log(myObj);

			//loginInfo[req.session.user].liked.splice(loginInfo[req.session.user].liked.indexOf(myObj), 1);
			delete loginInfo[req.session.user].liked[thisObj.name];
			thisObj.likes--;
			res.json(thisObj.likes);
		}
		else{
			res.status(404).send("Unknown ID");
		}
				
	});
}

//Returning an artist page
function getArtist(req, res, next){
	let aName = req.params.artistName;
	let artist = {};
	let done1 = false;
	let done2 = false;

	db.collection("artists").findOne({"artist":aName}, function(err, result){
		if(err){
			res.status(500).send("Error reading database.");
			return;
		}
		if(!result){
			res.status(404).send("Unknown ID");
			return;
		}

		if(result.hasOwnProperty('workShops')){
			artist.workShops = result.workShops;
		}
		else{
			artist.workShops = [];
		}
		done1 = true;

		if(done2 === true){
			res.render("artist",{artist:artist});
		}
		
	});

	

	db.collection("arts").find({"artist":aName}).toArray(function(err,result){
		if(err){
			res.status(500).send("Error reading database.");
			return;
		}
		if(!result){
			res.status(404).send("Unknown ID");
			return;
		}

		


		let artistWorks = result;
		artist.name = aName;
		artist.artWorks = artistWorks;


		done2 = true;

		if(done1 === true){
			res.render("artist",{artist:artist});
		}
		

		
	});


	
	
	
}


//Returning page for artists to add artworks
function addArtWorkPage(req, res, next){
	if(loginInfo.hasOwnProperty(req.session.user) && loginInfo[req.session.user].loggedIn === true && loginInfo[req.session.user].artist === true){
		res.render("addartworkpage", {});
	}
	else{
		res.render("notartist", {});
	}
	
}


//adding the artwork to the database
function addArtWork(req, res, next){
	let newArt = req.body;
	newArt.artist = req.session.user;


	db.collection("arts").insertOne(newArt, function(err, result){
		if(err){
			res.status(500).send("Error reading database.");
			return;
		}
		if(!result){
			res.status(404).send("Unknown ID");
			return;
		}
		
	});

	Object.keys(loginInfo).forEach(userName => {
		if(loginInfo[userName].following.includes(newArt.artist)){
			loginInfo[userName].notifications.push(`New art from ${newArt.artist}`);
		}
	});

	res.status(200).send();

	next();
}

//Sending the page for artists to add workshops
function addWorkShopPage(req, res, next){
	if(loginInfo.hasOwnProperty(req.session.user) && loginInfo[req.session.user].loggedIn === true && loginInfo[req.session.user].artist === true){
		res.render("addworkshoppage", {});
	}
	else{
		res.render("notartist", {});
	}
}

//Adding the workshop to the database
function addWorkShop(req, res, next){
	let newWorkShop = req.body;
	let newWorkShops;
	let done = false;
	let artist;

	db.collection("artists").findOne({artist:req.session.user}, function(err, result){
		if(err){
			res.status(500).send("Error reading database.");
			return;
		}
		if(!result){
			res.status(404).send("Unknown ID");
			return;
		}

		artist = result;

		newWorkShops = result.workShops;
		newWorkShops.push(newWorkShop);

		done = true;

		while(done !== true){

		}

		db.collection("artists").updateOne({artist:req.session.user}, {$set: {workShops: newWorkShops}}, function(err, result){
		
			if(err){
				res.status(500).send("Error reading database.");
				return;
			}
			if(!result){
				res.status(404).send("Unknown ID");
				return;
			}
	
			
		});

		Object.keys(loginInfo).forEach(userName => {
			if(loginInfo[userName].following.includes(req.session.user)){
				loginInfo[userName].notifications.push(`New workshop from ${req.session.user}`);
			}
		});

		
	});

	

	res.status(200).send();

	next();
}

//Returning the user's profile page
function userProfilePage(req, res, next){
	if(loginInfo.hasOwnProperty(req.session.user) && loginInfo[req.session.user].loggedIn === true){
		let thisObj = loginInfo[req.session.user];
		thisObj.username = req.session.user;
		res.render("userprofile", {stuff:thisObj});
	}
	else{
		res.render("notloggedin", {});
	}
	
	next();
}

function addReview(req, res, next){
	let oid;
	let newReview = req.session.user + " : " + req.body.review;

	
	try{
		oid = new mongo.ObjectId(req.params.artID);
	}catch{
		res.status(404).send("Unknown ID");
		return;
	}

	db.collection("arts").findOne({"_id":oid}, function(err, result){
		if(err){
			res.status(500).send("Error reading database.");
			return;
		}
		if(!result){
			res.status(404).send("Unknown ID");
			return;
		}

		let thisObj = result;

		if(thisObj.hasOwnProperty("reviews")){
			thisObj.reviews.push(newReview);
		}
		else{
			thisObj.reviews = [];
			thisObj.reviews.push(newReview);
		}

		db.collection("arts").updateOne({"_id":oid},{$set: {reviews: thisObj.reviews}}, function(err,result){
			if(err) throw err;
			
		});

		//let myObj = {};
		//myObj[thisObj.name] = oid;
		//console.log(myObj);

		loginInfo[req.session.user].reviewed[thisObj.name] = oid;
			
		res.status(200).send();
	
	});

	next();
}

//Following an artist
function followArtist(req, res, next){
	let artistName = req.params.artistName;

	if(loginInfo[req.session.user].following.includes(artistName) === false){
		loginInfo[req.session.user].following.push(artistName);
	}
	

	res.status(200).send();
}

//Unfollowing an artist
function unfollowArtist(req, res, next){
	let artistName = req.params.artistName;

	if(loginInfo[req.session.user].following.includes(artistName) === true){
		loginInfo[req.session.user].following.splice(loginInfo[req.session.user].following.indexOf(artistName), 1);
	}
	


	res.status(200).send();
}

//Sending a page with matching mediums
function getMediums(req, res, next){
	let mediumVal = req.params.theMediums;


	db.collection("arts").find({medium:mediumVal}).toArray(function(err,result){
		if(err) throw err;

		let artWorks = result;

		res.render("matchingartworks",{artWorks:artWorks});
	});
	
}

//Sending a page with matching categories
function getCategories(req, res, next){
	let categoryVal = req.params.theCategories;


	db.collection("arts").find({category:categoryVal}).toArray(function(err,result){
		if(err) throw err;

		let artWorks = result;

		res.render("matchingartworks",{artWorks:artWorks});
	});
}


//Sending whether or not this user has liked that picture
function didILike(req, res, next){
	let artID = req.params.artID;
	let isThere = false;

	for(let i = 0; i < Object.values(loginInfo[req.session.user].liked).length; i++){
		if(Object.values(loginInfo[req.session.user].liked) == (artID)){
			isThere = true;
		}
	}


	res.status(200).send(JSON.stringify(isThere));
		

}



// Initialize database connection
MongoClient.connect("mongodb://127.0.0.1:27017/", { useNewUrlParser: true }, function(err, client) {
  if(err) throw err;

  //Get the Artworks
  db = client.db('ArtWorks');

  // Start server once Mongo is initialized
  app.listen(3000);
  console.log("Listening on port 3000");
  console.log("http://localhost:3000/");
});
