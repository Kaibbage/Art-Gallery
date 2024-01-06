let objID;
let likeNum;

//Initializing like button to liked or not liked as well as the number of likes
function init(){
    let likeButtonSpot = document.getElementById("likeButtons");
    
    objID = document.getElementById("passerID").value;

    let req2 = new XMLHttpRequest();
	req2.onreadystatechange = function() {
		if(this.readyState==4 && this.status==200){
            if(this.response === "true"){
                likeButtonSpot.innerHTML = 	'<img src="https://www.pngitem.com/pimgs/m/175-1755091_facebook-icon-free-download-youtube-like-button-transparent.png" alt="like" onclick="dislike()" style =width:50px; height:50px;>';
            }
            else{
                likeButtonSpot.innerHTML = 	'<img src="https://www.pngitem.com/pimgs/m/129-1293150_file-like-svg-wikimedia-commons-png-youtube-blue.png" alt="like" onclick="like()" style =width:50px; height:50px;>';
            }
		}
	}
	
	req2.open("GET", `/like/${objID}`, false);
	req2.setRequestHeader("Accept", "application/json");
    req2.send();

    let req = new XMLHttpRequest();
	req.onreadystatechange = function() {
		if(this.readyState==4 && this.status==200){
            likeNum = JSON.parse(this.response);
            document.getElementById("likeNum").innerHTML = likeNum;
		}
	}
	
	req.open("GET", `/getLikes/${objID}`, false);
	req.setRequestHeader("Accept", "application/json");
    req.send();


}

//Liking and sending to server and database
function like(){
    let likeButtonSpot = document.getElementById("likeButtons");
    likeButtonSpot.innerHTML = 	'<img src="https://www.pngitem.com/pimgs/m/175-1755091_facebook-icon-free-download-youtube-like-button-transparent.png" alt="like" onclick="dislike()" style =width:50px; height:50px;>';

    let req = new XMLHttpRequest();
	req.onreadystatechange = function() {
		if(this.readyState==4 && this.status==200){
            likeNum = JSON.parse(this.response);
            document.getElementById("likeNum").innerHTML = likeNum;
		}
	}
	req.open("PUT", `/setLikesP/${objID}`, true);
	req.setRequestHeader("Content-Type", "application/json");
   
    req.send();
}

//Cancelling liking and sending to server and database
function dislike(){
    let likeButtonSpot = document.getElementById("likeButtons");
    likeButtonSpot.innerHTML = 	'<img src="https://www.pngitem.com/pimgs/m/129-1293150_file-like-svg-wikimedia-commons-png-youtube-blue.png" alt="like" onclick="like()" style =width:50px; height:50px;>';

    let req = new XMLHttpRequest();
	req.onreadystatechange = function() {
		if(this.readyState==4 && this.status==200){
            likeNum = JSON.parse(this.response);
            document.getElementById("likeNum").innerHTML = likeNum;
		}
	}
	
	req.open("PUT", `/setLikes-/${objID}`, true);
	req.setRequestHeader("Content-Type", "application/json");
   
    req.send();

}

//Leaving a review and sending to server and database
function addReview(){
    let addReviewSpot = document.getElementById("addReviewSpot");
    let review = document.getElementById("review").value;
    addReviewSpot.innerHTML += `<p> ${review} <p>`;

    let myObj = {};
    myObj.review = review;

    let req = new XMLHttpRequest();
    req.onreadystatechange = function() {
		if(this.readyState==4 && this.status==200){
            alert("Your review has been added");
		}
	}
	
	req.open("PUT", `/addReview/${objID}`, true);
	req.setRequestHeader("Content-Type", "application/json");
   
    req.send(JSON.stringify(myObj));

}