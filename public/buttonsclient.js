//Making the user into an artist on server
function becomeArtist(){
    let req = new XMLHttpRequest();
	req.onreadystatechange = function() {
		if(this.readyState==4 && this.status==200){
            if(this.response === 'true'){
                alert("You have become an artist");
            }
            else if(this.response === "false"){
                alert("You are not logged in");
            }
            else{
                alert("You are already an artist");
            }
            
            
		}
	}
	
	req.open("PUT", `/becomeArtist`, true);
    req.send();
}

//Making the user into a patron on server
function becomePatron(){
    let req = new XMLHttpRequest();
	req.onreadystatechange = function() {
		if(this.readyState==4 && this.status==200){
            if(this.response === 'true'){
                alert("You have become a patron");
            }
            else if(this.response === "false"){
                alert("You are not logged in");
            }
            else{
                alert("You are already a patron");
            }
            
            
		}
	}
	
	req.open("PUT", `/becomePatron`, true);
    req.send();
}

//Logging out on server
function logOut(){
    let req = new XMLHttpRequest();
	req.onreadystatechange = function() {
		if(this.readyState==4 && this.status==200){

                alert("You have logged out");
            
		}
	}
	
	req.open("PUT", `/logOut`, true);
    req.send();
}