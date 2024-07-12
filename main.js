import { logText } from "./src/logging.js";
import { readJSONDirectory } from "./src/json.js";
import { quickSort } from "./src/sorting.js";
import { wand } from "./src/wand.js";
import { assignStaticButtons } from "./src/buttons.js";
import { fetchCookies } from "./src/cookies.js";

//allow new wands to be built on runtime
//allow wands to be renamed

//allow wands to be saved and loaded
//allow spell components to be saved and loaded

//show errors with the wand
//build all of the spellDescriptions into a complete picture

//bake some cookies (or json files)
//work on the martial arts
//add more spellComponents

logText("--Starting...");

logText("--Retrieving element IDs...");

const loadingScreen = document.getElementById("loadingScreen");
const spellBox = document.getElementById("spellBox");
export const componentList = [];
const wandList = [];

logText("--Assigning buttons...");
assignStaticButtons();

logText("--Fetching cookies...");
fetchCookies();

logText("--Trying to read spell components...");
await buildComponentsFromFiles();

logText("--Sorting spell components...");
quickSort(componentList);

logText("--Tring to build wands...");
buildWands();

logText("--Drawing spell components...");
drawAll(componentList);

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

function drawAll(components) {
    for (const component of components) {
        logText("Drawing " + component.name + "...");
        component.drawElement(spellBox);
    }
}

async function buildWands(){
    const dir = "data/wands";
    logText("Exploring: " + dir);
    await readJSONDirectory(dir);
}

function finishLoading() {
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