function init(){
    let refButton = document.getElementById("refresh");
    refButton.onclick = function(){search(makeReq)};
    
}

let artistName;
let cardName;
let categoryKeyword;

//Searching the database in the server
function search(makeRequirements){

    makeRequirements();


    let req = new XMLHttpRequest();
	req.onreadystatechange = function() {
		if(this.readyState==4 && this.status==200){
            document.getElementById("results").innerHTML = this.response;
		}
	}
	
	req.open("GET", `/artWorks?artist=${artistName}&name=${cardName}&keyword=${categoryKeyword}`, false);
	req.setRequestHeader("Accept", "text/html");
    req.send();
}

//Getting the requirements for the search from the textboxes
function makeReq(){

    artistName = document.getElementById("artist").value.toString();
    cardName = document.getElementById("name").value.toString();
    categoryKeyword = document.getElementById("keyword").value.toString();
    
    
}