function init(){
    document.getElementById("submitButton").onclick = function(){submitToDatabase()};
}

//Submitting new workshop to database
function submitToDatabase(){
    let nameVal = document.getElementById("name").value;


    let myObj = {};
    myObj.name = nameVal;


    let req = new XMLHttpRequest();
	req.onreadystatechange = function() {
		if(this.readyState==4 && this.status==200){
            alert("You have added your workshop");
		}
	}
	
	req.open("POST", `/addWorkShop`, false);
	req.setRequestHeader("Content-Type", "application/json");
    req.send(JSON.stringify(myObj));


}