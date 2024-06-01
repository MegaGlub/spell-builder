var fs = module.require('fs');
import { spellComponent } from "./spellComponent.js";
import { formComponent } from "./formComponent.js";
import { pathComponent } from "./pathComponent.js";
import { triggerComponent } from "./triggerComponent.js";
import { purposeComponent } from "./purposeComponent.js";
import { enhancementComponent } from "./enhancementComponent.js";

export function readJSONDirectory(dirPath) {
    const freshComponents = [];
    fs.readdirSync(dirPath).forEach(file => {
        freshComponents.push(fetchRawJSON(dirPath + "/" + file));
    });
    console.log(freshComponents);
    return freshComponents;
}

function fetchRawJSON(fileName) {
    fetch(fileName)
        .then(response => response.json())
        .then(jsonResponse => {
            return convertJSONToSpellComponent(jsonResponse)
        });
}

function convertJSONToSpellComponent(json) {
    switch (json.type) {
        case "Form":
            const result = createFormComponentFromJSON(json);
            console.log(result);
            return result;
        case "Path":
            return createPathComponentFromJSON(json);
        case "Trigger":
            return createTriggerComponentFromJSON(json);
        case "Enhancement":
            return createEnhancementComponentFromJSON(json);
        case "Purpose":
            return createPurposeComponentFromJSON(json);
        default:
            return createMiscComponentFromJSON(json);
    }
}

function createFormComponentFromJSON(json) {
    var result = new formComponent(
        json.name,
        json.description,
        json.formDescription,
        json.image,
        json.costs.primary,
        json.costs.secondary,
        json.costs.energy,
        json.potency,
        json.size
    );
    console.log(result);
    return result;
}

function createPathComponentFromJSON(json) {
    return new pathComponent(
        json.name,
        json.description,
        json.pathDescription,
        json.image,
        json.costs.primary,
        json.costs.secondary,
        json.costs.energy,
        json.potency,
        json.range,
        json.lifetime
    );
}

function createTriggerComponentFromJSON(json) {
    return new triggerComponent(
        json.name,
        json.description,
        json.triggerDescription,
        json.image,
        json.costs.primary,
        json.costs.secondary,
        json.costs.energy,
        json.potency
    );
}

function createEnhancementComponentFromJSON(json) {
    return new enhancementComponent(
        json.name,
        json.description,
        json.enhancementDescription,
        json.image,
        json.costs.primary,
        json.costs.secondary,
        json.costs.energy,
        json.enhancement.type,
        json.enhancement.modifier,
        json.enhancement.multiplier,
        json.enhancement.showStats
    );
}

function createPurposeComponentFromJSON(json) {
    return new purposeComponent(
        json.name,
        json.description,
        json.purposeDescription,
        json.image,
        json.costs.primary,
        json.types.primary,
        json.costs.secondary,
        json.types.secondary,
        json.costs.energy,
        json.purpose.target
    );
}

function createMiscComponentFromJSON(json) {
    return new spellComponent(
        json.name,
        json.type,
        json.description,
        json.image,
        json.costs.primary,
        json.vis.primary,
        json.costs.secondary,
        json.vis.secondary,
        json.costs.energy,
        json.potency
    );
}