import { savedComponentNames, wandList } from "../main.js";
import { createArrayFromJSON, fetchRawJSON, saveJSONFile } from "./json.js";
import { logText } from "./logging.js";

export async function fetchCookies(){
    logText("Technically, these aren't cookies.\nDon't tell anyone that.");
    const cookieComponents = await fetchRawJSON("data/save/availableComponents.json", createArrayFromJSON);
    for (let componentName of cookieComponents){
        savedComponentNames.push(componentName);
    }
}

export async function saveCookies(){
    logText("--Saving...");
    const components = packageComponentsForSave();
    saveJSONFile(components, "data/save/availableComponents.json", () => {logText("Components saved!")});
    for (let wand of wandList){
        wand.saveToFile();
    }
}

function packageComponentsForSave(){
    let result = "{\"arr\": [";
    for (let component of savedComponentNames){
        result += component;
    }
    result += "]}";
    return result;
}