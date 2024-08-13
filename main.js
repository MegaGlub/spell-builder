import { logText } from "./src/logging.js";
import { readJSONDirectory } from "./src/json.js";
import { quickSort } from "./src/sorting.js";
import { wand } from "./src/wand.js";
import { assignClickableButtonByElement, assignStaticButtons } from "./src/buttons.js";
import { fetchCookies } from "./src/cookies.js";

//allow wands to be saved and loaded
//allow spell components to be saved and loaded

//show errors with the wand
//build all of the spellDescriptions into a complete picture

//make voidable components glow purple when hovering/holding the void spell (css dropshadow)

//bake some cookies (or json files)
//work on the martial arts
//add more spellComponents

logText("--Starting...");

logText("--Retrieving element IDs...");

export const componentList = [];
export const wandList = [];

logText("--Assigning buttons...");
assignStaticButtons();

logText("--Fetching cookies...");
fetchCookies();

logText("--Trying to read spell components...");
await buildComponentsFromFiles();

logText("--Sorting spell components...");
quickSort(componentList);

logText("--Drawing spell components...");
drawAll(componentList, document.getElementById("spellBox"));

logText("--Tring to build wands...");
await buildWands();

logText("--Drawing wands...");
drawAll(wandList, document.getElementById("wandSelector"));

logText("--Complete!");
finishLoading();

async function buildComponentsFromFiles() {
    const root = "data/components/";
    const leaves = ["enhancements", 
        "forms", 
        "misc", 
        "paths", 
        "purposes", 
        "triggers"];
    for (const leaf of leaves) {
        logText("Exploring: " + root + leaf);
        const freshComponents = await readJSONDirectory(root + leaf);
        for (const component of freshComponents) {
            componentList.push(component);
        }
    }
}

async function buildWands(){
    const dir = "data/wands";
    logText("Exploring: " + dir);
    const freshWands = await readJSONDirectory(dir);
    for (const wand of freshWands) {
        wandList.push(wand);
    }
}

function drawAll(drawableElements, destination) {
    for (const drawable of drawableElements) {
        logText("Drawing " + drawable.name + "...");
        drawable.drawElement(destination);
    }
}

function finishLoading() {
    const loadingScreen = document.getElementById("loadingScreen");
    loadingScreen.style.display = "none";
}

export function findComponentByName(name){
    let i = 0;
    for (let component of componentList){
        if (component.name == name){
            return i;
        }
        i++;
    }
    return -1; //return -1 if not in the list
}