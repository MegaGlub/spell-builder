export function readJSONDirectory(dirPath) {
    fs.readdirSync(dirPath).forEach(file => {
        fetchRawJSON(dirPath + "/" + file);
    });
}

function fetchRawJSON(fileName) {
    fetch(fileName)
        .then(response => response.json())
        .then(jsonResponse => {
            convertJSONToSpellComponent(jsonResponse)
        });
}

function convertJSONToSpellComponent(json) {
    switch (json.type) {
        case "Form":
            createFormComponentFromJSON(json);
            return;
        case "Path":
            createPathComponentFromJSON(json);
            return;
        case "Trigger":
            createTriggerComponentFromJSON(json);
            return;
        case "Enhancement":
            createEnhancementComponentFromJSON(json);
            return;
        case "Purpose":
            createPurposeComponentFromJSON(json);
            return;
        default:
            createVoidComponentFromJSON(json);
            return;
    }
}

function createFormComponentFromJSON(json) {
    return new formComponent(
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

function createVoidComponentFromJSON(json) {
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