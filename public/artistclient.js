//Showing registration with an alert
function register(){
    alert("You have registered for this workshop");
}

//Following
function follow(){
    let artistName = document.getElementById("passerName").value;

    let req = new XMLHttpRequest();
	req.onreadystatechange = function() {
		if(this.readyState==4 && this.status==200){
            alert("You have followed this artist");
		}
	}
	
	req.open("PUT", `/followArtist/${artistName}`, true);
	req.setRequestHeader("Accept", "application/json");
    req.send();
}

//Unfollowing
function unfollow(){
    let artistName = document.getElementById("passerName").value;

    let req = new XMLHttpRequest();
	req.onreadystatechange = function() {
		if(this.readyState==4 && this.status==200){
            alert("You have unfollowed this artist");
		}
	}
	
	req.open("PUT", `/unfollowArtist/${artistName}`, true);
	req.setRequestHeader("Accept", "application/json");
    req.send();
}