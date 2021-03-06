function verificaMail(email){
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function verificaUsuario(username){
    let isValid = true;
    const re = /^[a-z0-9]+$/i;

    if (username.length < 4) {
        isValid = false;
    }
    else if (!re.test(String(username).toLowerCase())) {
        isValid = false;
    }
    else if(!isNaN(username[0])){
        isValid = false;
    }


    return isValid;
}

function verificaPassword(password){
    let isValid = true;
    const regLetter = /[a-zA-Z]/g;
    const regNumber = /\d/;

    if (password.length < 8) {
        isValid = false;
    }
    else if (!regLetter.test(String(password).toLowerCase())) {
        isValid = false;
    }
    else if (!regNumber.test(String(password).toLowerCase())) {
        isValid = false;
    }

    return isValid;
}

module.exports = {verificaMail, verificaPassword, verificaUsuario};