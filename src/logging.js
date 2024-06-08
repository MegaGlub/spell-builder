const loadingLog = document.getElementById("loadingLog");
const modalContent = document.getElementById("modalContent");
const modalBackground = document.getElementById("modalBackground");

var logs = "";

export function showLog() {
    console.log("Showing log...");
    modalBackground.style.display = "block";
    modalContent.innerHTML = logs;
}

export function logText(text) {
    console.log(text);
    loadingLog.innerHTML = text;
    logs = logs + "\n" + text;
}