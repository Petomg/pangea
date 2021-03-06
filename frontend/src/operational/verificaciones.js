export function verificaMail(email){
    let isValid = true;

    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if(!re.test(String(email).toLowerCase())){
        isValid = "Invalid Email";
    }
   
    return isValid;
}

export function verificaUsuario(username){
    let isValid = true;
    const re = /^[a-z0-9]+$/i;

    if (username.length < 4) {
        isValid = "Username must be at least 4 characters long";
    }
    else if (!re.test(String(username).toLowerCase())) {
        isValid = "Username must be alphanumeric";
    }
    else if(!isNaN(username[0])){
        isValid = "Username must not start with a number";
    }


    return isValid;
}

export function verificaPassword(password){
    let isValid = true;
    const regLetter = /[a-zA-Z]/g;
    const regNumber = /\d/;

    if (password.length < 8) {
        isValid = "Password must be at least 8 characters long";
    }
    else if (!regLetter.test(String(password).toLowerCase())) {
        isValid = "Password must contain at least one letter";
    }
    else if (!regNumber.test(String(password).toLowerCase())) {
        isValid = "Password must contain at least one number";
    }

    return isValid;
}

