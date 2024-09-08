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
        return this.roundTo2(seconds / 3600) + " hours";
    }
    else if (seconds == 60) {
        return "1 minute";
    }
    else if (seconds / 60 > 1) {
        return this.roundTo2(seconds / 60) + " minutes";
    }
    else if (seconds == 1) {
        return "1 second";
    } else {
        return seconds + " seconds";
    }
}

export function formatSize(size) {
    if (size > 1000) {
        return Math.round(size / 1000) + "m";
    } else {
        return size + "cm";
    }
}