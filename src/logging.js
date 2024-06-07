const loadingLog = document.getElementById("loadingLog");

export function showLog() {
    console.log("Show log");
    //to-do, after modals
}

export function logText(text) {
    console.log(text);
    loadingLog.innerHTML = text;
    //the log at the bottom should also receive the text
}