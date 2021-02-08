export let formatDate = function(date){
    if(date !== undefined){
        let toDate = date.indexOf("T");
        let toTime = date.indexOf(".");
        let dateS = date.substring(0, toDate);
        let timeS = date.substring(toDate+1, toTime - 3);
        return dateS + " " + timeS; 
    }
}