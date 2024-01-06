function init(){
    document.getElementById("submitButton").onclick = function(){submitToDatabase()};
}

//Submitting the new object
function submitToDatabase(){
    let nameVal = document.getElementById("name").value;
    let yearVal = document.getElementById("year").value;
    let categoryVal = document.getElementById("category").value;
    let mediumVal = document.getElementById("medium").value;
    let descriptionVal = document.getElementById("description").value;
    let imageVal = document.getElementById("image").value;

    let myObj = {};
    myObj.name = nameVal;
    myObj.year = yearVal;
    myObj.category = categoryVal;
    myObj.medium = mediumVal;
    myObj.description = descriptionVal;
    myObj.image = imageVal;

    let req = new XMLHttpRequest();
	req.onreadystatechange = function() {
		if(this.readyState==4 && this.status==200){
            alert("You have added your art");
		}
	}
	
	req.open("POST", `/addArtWork`, false);
	req.setRequestHeader("Content-Type", "application/json");
    req.send(JSON.stringify(myObj));


}