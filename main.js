import { logText } from "./src/logging.js";
import { readJSONDirectory } from "./src/json.js";
import { quickSort } from "./src/sorting.js";
import { wand } from "./src/wand.js";
import { assignStaticButtons } from "./src/buttons.js";
import { fetchCookies } from "./src/cookies.js";

//work on the wand box
//figure out how to make new wands
//how to fill wands
//build descriptions
//show errors with the wand
//bake some cookies (or json files)
//work on the martial arts
//add more spellComponents

logText("--Starting...");

logText("--Retrieving element IDs...");

const loadingScreen = document.getElementById("loadingScreen");
const spellBox = document.getElementById("spellBox");
const componentList = [];
const wandList = [];

logText("--Assigning buttons...");
assignStaticButtons();

logText("--Fetching cookies...");
fetchCookies();

logText("--Trying to read spell components...");
await buildComponentsFromFiles();

logText("--Sorting spell components...");
quickSort(componentList);

logText("--Drawing spell components...");
drawAll(componentList);

logText("--Complete!");
finishLoading();

const testWand = new wand("Eenis", "images/wands/wand-draft.png", 3);

async function buildComponentsFromFiles() {
    const root = "data/components/";
    const leaves = ["enhancements", "forms", "misc", "paths", "purposes", "triggers"];
    for (const leaf of leaves) {
        logText("Exploring: " + root + leaf);
        const freshComponents = await readJSONDirectory(root + leaf);
        for (const component of freshComponents) {
            componentList.push(component);
        };
    };
}

function drawAll(components) {
    for (const component of components) {
        logText("Drawing " + component.name + "...");
        component.drawElement(spellBox);
    }
}

function finishLoading() {
    loadingScreen.style.display = "none";
}