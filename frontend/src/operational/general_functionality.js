import jwt from 'jsonwebtoken';
import Cookies from 'universal-cookie';
const cookies = new Cookies();

export let formatDate = function(date){
    if(date !== undefined){
        let toDate = date.indexOf("T");
        let toTime = date.indexOf(".");
        let dateS = date.substring(0, toDate);
        let timeS = date.substring(toDate+1, toTime - 3);
        return dateS + " " + timeS; 
    }
}

export let checkUserValid = function(userid) {
    let isValid = false;
    var token = cookies.get("nToken");
    if(token !== undefined && token !== null){
        var decodedToken = jwt.decode(token, { complete: true }) || {};
        if (decodedToken.payload.user._id === userid){
            isValid = true;
        } 
    }

    return isValid;
}

export let isLoggedIn = function() {
    return (cookies.get("nToken") !== undefined && cookies.get("nToken") !== null);
}

export let getReputation = function(rep) {
    let title = "";
    if (rep != undefined){
        if (rep == 0) {
            title = "Spectator";
        } else if (rep > 0 && rep <= 1000) {
            title = "Populizer";
        } else if (rep > 1000 && rep <= 2000) {
            title = "Crier";
        } else if (rep > 2000 && rep <= 3000) {
            title = "Watson";
        } else if (rep > 3000) {
            title = "Argentine Lawyer";
        }
    }
    return title;
}