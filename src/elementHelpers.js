export function clearChildren(parentElement) {
    while (parentElement.firstChild) {
        parentElement.removeChild(parentElement.firstChild);
    }
}

export function getSign(num) {
    if (num < 0) {
        return num; // negative numbers already have the "-" character
    } else {
        return "+" + num;
    }
}

export function timeFormat(seconds) {
    if (seconds == 3600) {
        return "1 hour";
    }
    else if (seconds / 3600 > 1) {
        return roundTo2(seconds / 3600) + " hours";
    }
    else if (seconds == 60) {
        return "1 minute";
    }
    else if (seconds / 60 > 1) {
        return roundTo2(seconds / 60) + " minutes";
    }
    else if (seconds == 1) {
        return "1 second";
    } else {
        return Math.round(seconds) + " seconds";
    }
}

function roundTo2(num) {
    return Math.round(num * 100) / 100;
  }

export function formatSize(size) {
    if (size >= 100) {
        return Math.round(size / 100) + "m";
    } else {
        return Math.round(size) + "cm";
    }
}

export function sewArrays(arr1, arr2) {
    for (let i = 0; i < arr2.length; i++){
        if (!arr1.includes(arr2[i])){
            arr1.push(arr2[i]);
        }
    }
    return arr1;
}

export function emptyArray(arr){
    arr.splice(0, arr.length);
}

export function filterStringForJSON(str){
    let result = str;
    result = result.trim();
    const whiteSpaceRegex = /\r\r|\r|\n/g;
    result = result.replace(whiteSpaceRegex, "\\n");
    const quoteRegex = /\"/g;
    result = result.replace(quoteRegex, "\\\"");
    const singleQuoteRegex = /\'/g;
    result = result.replace(singleQuoteRegex, "\\\'");
    const filterRegex = /[^A-Za-z0-9\"\'-\_\!\?\.\,\[\]\@\#\$\%\^\&\*\(\)\ \n]/g;
    result = result.replaceAll(filterRegex, "");
    result = result.trim();
    return result;
}