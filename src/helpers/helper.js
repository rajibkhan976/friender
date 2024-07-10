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

const debounce=(func, delay)=>{
    let timeoutId;
  
    return function (...args) {
      clearTimeout(timeoutId);
  
      timeoutId = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  }
function camelToSnake(camelCaseStr) {
    return camelCaseStr
        .replace(/([a-z])([A-Z])/g, '$1_$2') // Insert underscore between lowercase and uppercase letters
        .toLowerCase(); // Convert the entire string to lowercase
}

const fieldCorrector = (field) => {
    const customValue = {
        created_at: "age",
        keywords:"matchedKeyword"

    }
    return customValue[field] ? customValue[field] : field;
}
const operatorsCorrector = (field) => {
    const customValue = {
        greater_than_or_equal_to: "greater_than_or_equals",
        less_than_or_equal_to: "less_than_or_equals"
    }
    return customValue[field] ? customValue[field] : field;
}
const listFilterParamsGenerator = (columnFilter, filterFns) => {
    if (!columnFilter || columnFilter.length === 0) {
        return null;
    }
    let values = [];
    let fields = [];
    let operators = [];
    columnFilter.forEach((item, idx) => {
        // encodeURIComponent
        values.push([encodeURIComponent(String(item.value))]);
        fields.push(fieldCorrector(item.id));
        operators.push(filterFns[item.id] ? [operatorsCorrector(camelToSnake(filterFns[item.id]))] : ["contains"]);

    })
    return {
        values,
        fields,
        operators
    }
}
function generateUrl(baseUrl, params) {
    const url = new URL(baseUrl);

    Object.keys(params).forEach(key => {
        const value = params[key];

        if (value === null || value === undefined) {
            // Skip null or undefined values
            return;
        }

        if (Array.isArray(value)) {
            value.forEach((item, index) => {
                if (Array.isArray(item)) {
                    item.forEach((subItem, subIndex) => {
                        url.searchParams.append(`${key}[${index}][${subIndex}]`, subItem);
                    });
                } else {
                    url.searchParams.append(`${key}[]`, item);
                }
            });
        } else {
            url.searchParams.append(key, value);
        }
    });

    return url.toString();
}
module.exports = {
    setCookie, 
    getCookie, 
    deleteCookie,
    curretUTCTime,
    sleep,
    debounce,
    listFilterParamsGenerator,
    generateUrl
}