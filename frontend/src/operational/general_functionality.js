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