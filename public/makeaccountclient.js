let username;
let password;
let infoArr = [];
function init(){

    document.getElementById("submitButton").onclick = function(){submitInfo()};
    
}

//Making the client's account
function submitInfo(){
    username = document.getElementById("UserName").value;
    password = document.getElementById("PassWord").value;

    infoArr = [];
    infoArr.push(username);
    infoArr.push(password);
    
    
    let req = new XMLHttpRequest();
	req.onreadystatechange = function() {
		if(this.readyState==4 && this.status==200){
            if(this.response === "true"){
                alert("You have made an account!");
            }
            else{
                alert("That username is taken");
            }
            
		}
	}
	
	req.open("POST", `/loginInfo`, false);
	req.setRequestHeader("Content-Type", "application/json");
    req.send(JSON.stringify(infoArr));
    
}