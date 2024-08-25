import { logText } from "./logging.js";

export function fetchCookies(componentNames){
    logText("Technically, these aren't cookies.\nDon't tell anyone that.");
    componentNames.push("Nothing");
    componentNames.push("Ball");
    componentNames.push("Bolt");
    componentNames.push("Polymorph");
    componentNames.push("Arc");
    //grab an array from a json file, then put it into componentNames
    //may have to refactor json.js
}