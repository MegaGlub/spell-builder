var fs = window.ballfish.require('fs');
import { spellComponent } from "./spellComponent.js";
import { formComponent } from "./formComponent.js";
import { pathComponent } from "./pathComponent.js";
import { triggerComponent } from "./triggerComponent.js";
import { purposeComponent } from "./purposeComponent.js";
import { enhancementComponent } from "./enhancementComponent.js";
import { wand } from "./wand.js";
import { logText } from "./logging.js";
import { branchComponent } from "./branchComponent.js";
import { martialAction } from "./martialAction.js";

export async function readJSONDirectory(dirPath, processingFunct) {
    const result = [];
    const files = fs.readdirSync(dirPath);
    for (const file of files){
        // logText("\tFound " + file + ".");
        result.push(await fetchRawJSON(dirPath + "/" + file, processingFunct));
    }
    return result;
}

export async function fetchRawJSON(fileName, processingFunct) { //Thanks Josh194 for helping me with async!
    return fetch(fileName) //asynchronous bastard, ruining my perfectly synchronous code
        .then(response => response.json())
        .then(jsonResponse => {
            return processingFunct(jsonResponse);
        });
}

export function createComponentFromJSON(json) {
    switch (json.type) {
        case "Branch":
            return createBranchComponentFromJSON(json);
        case "Enhancement":
            return createEnhancementComponentFromJSON(json);
        case "Form":
            return createFormComponentFromJSON(json);
        case "Path":
            return createPathComponentFromJSON(json);
        case "Purpose":
            return createPurposeComponentFromJSON(json);
        case "Trigger":
            return createTriggerComponentFromJSON(json);
        default:
            return createMiscComponentFromJSON(json);
    }
}

function createBranchComponentFromJSON(json) {
    return new branchComponent(
        json.name,
        json.flavor,
        json.branchDescription,
        json.image,
        json.costs,
        json.statBlock,
        false
    )
}

function createEnhancementComponentFromJSON(json) {
    return new enhancementComponent(
        json.name,
        json.flavor,
        json.enhancementDescription,
        json.image,
        json.costs,
        json.statBlock,
        false
    );
}

function createFormComponentFromJSON(json) {
    return new formComponent(
        json.name,
        json.flavor,
        json.formDescription,
        json.image,
        json.costs,
        json.statBlock,
        false
    );
}

function createPathComponentFromJSON(json) {
    return new pathComponent(
        json.name,
        json.flavor,
        json.pathDescription,
        json.image,
        json.costs,
        json.statBlock,
        false
    );
}

function createPurposeComponentFromJSON(json) {
    return new purposeComponent(
        json.name,
        json.flavor,
        json.purposeDescriptions,
        json.image,
        json.costs,
        json.target,
        json.statBlock,
        false
    );
}

function createTriggerComponentFromJSON(json) {
    return new triggerComponent(
        json.name,
        json.flavor,
        json.triggerDescription,
        json.image,
        json.costs,
        json.statBlock,
        false
    );
}

function createMiscComponentFromJSON(json) {
    return new spellComponent(
        json.name,
        json.type,
        json.flavor,
        json.image,
        json.costs,
        json.statBlock,
        false
    );
}

export function createWandFromJSON(json){
    return new wand(
        json.name,
        json.flavor,
        json.image,
        json.slots,
        json.statBlock,
        json.lockedSlots
    );
}

export function createMartialFromJSON(json){
    return new martialAction(
        json.name,
        json.category,
        json.statBlock,
        json.editBlock,
        json.skillBlock
    )
}

export function createArrayFromJSON(json){
    return json.arr;
}

export async function saveJSONFile(fileName, stringJSON, returnCallback){
    fs.writeFile(fileName, stringJSON, {}, returnCallback);
}

export async function destroyFile(fileName, returnCallback){
    fs.unlink(fileName, returnCallback);
}

export function formatFileName(name){
    let fileName = name;
    const regex = /[^A-Za-z0-9-]/g;
    fileName = fileName.trim();
    fileName = fileName.replaceAll(" ", "-");
    fileName = fileName.replaceAll(regex, "");
    fileName = fileName.toLowerCase();
    fileName = fileName.trim();
    return fileName;
}