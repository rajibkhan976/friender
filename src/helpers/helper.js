const defaultExpiryMinutes = 10;

const  setCookie = (name, value, minutes = defaultExpiryMinutes) => {
    var expires = "";
    if (minutes) {
        var date = new Date();
        date.setTime(date.getTime() + (minutes*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}
const getCookie = (name) => {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}
const deleteCookie = (name) => {   
    document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

const sleep = (ms) => {
    console.log("SLEEP for ", ms / 1000 + " Second(s)");
    return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Return current UTC time in seconds   
 * @param {*} name 
 */

const curretUTCTime = () => {   
    var ct = new Date();
    return ct.getTime() + ct.getTimezoneOffset() * 60000;
}

module.exports = {
    setCookie, 
    getCookie, 
    deleteCookie,
    curretUTCTime,
    sleep
}