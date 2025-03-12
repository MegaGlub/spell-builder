import { projectPath } from "../main.js";
import { assignEditableTextByElement } from "./buttons.js";
import { filterStringForJSON, formatSize } from "./elementHelpers.js";
import { formatFileName, saveJSONFile } from "./json.js";
import { logText } from "./logging.js";
import { assignToolTip } from "./toolTips.js";
export class martialAction {
    constructor(name, category, statBlock, editBlock, skillBlock) {
        this.name = name;
        this.category = category;
        this.statBlock = this.#discoverMap(statBlock);
        this.editBlock = this.#discoverMap(editBlock);
        this.skillBlock = this.#discoverMap(skillBlock);

        this.#buildActionVisuals();
    }

    #discoverMap(possibleMap) {
        if (possibleMap[Symbol.toStringTag] == "Map") {
            return possibleMap;
        } else {
            return new Map(Object.entries(possibleMap));
        }
    }

    #buildActionVisuals() {
        this.#createEmptyElements();
        this.#assignElementClasses();
        this.#assignElementIds();
        this.#assignImages();
        this.#relateElements();
        this.#fillInnerHTML();
    }

    #createEmptyElements() {
        this.descriptionElement = document.createElement("span");
        this.titleElement = document.createElement("div");
        this.requirementElement = document.createElement("div");
        this.damageElement = document.createElement("div");
        this.toHitElement = document.createElement("div");
        this.costElement = document.createElement("div");
        this.rangeElement = document.createElement("div");
        this.effectsElement = document.createElement("div");
        this.notesElement = document.createElement("div");
        this.revertButtonElement = document.createElement("img");
    }

    #assignElementClasses() {
        this.descriptionElement.className = "actionDescription";
        this.titleElement.className = "actionTitle";
        this.requirementElement.className = "actionStatRow";
        this.damageElement.className = "actionStatCell";
        this.toHitElement.className = "actionStatCell";
        this.costElement.className = "actionStatCell";
        this.rangeElement.className = "actionStatCell";
        this.effectsElement.className = "actionStatRow";
        this.notesElement.className = "actionStatRow";
        this.revertButtonElement.className = "actionRevertButton";
    }

    #assignElementIds() {
        this.descriptionElement.id = "martialAction" + this.name;
    }

    #assignImages() {
        this.revertButtonElement.src = "images/ui/revert.png"; //Placeholder, remember to replace
    }

    #relateElements() {
        this.descriptionElement.appendChild(this.titleElement);
        this.descriptionElement.appendChild(this.revertButtonElement);
    }

    #fillInnerHTML() {
        this.titleElement.innerHTML = this.name;
        this.#fillStatTable();
    }

    #fillStatTable(){
        this.#generateDataCell(this.requirementElement, "Requirements", this.#formatBasicStat, "requirements", this.handleBasicStatEdit.bind(this));
        this.#generateDataCell(this.damageElement, "Damage", this.#formatBasicStat, "damage", this.handleBasicStatEdit.bind(this));
        this.#generateDataCell(this.toHitElement, "To-Hit", this.#formatBasicStat, "toHit", this.handleBasicStatEdit.bind(this));
        this.#generateDataCell(this.costElement, "Cost", this.#formatAP, "cost", this.handleCostEdit.bind(this));
        this.#generateDataCell(this.rangeElement, "Range", this.#formatRange, "range", this.handleRangeEdit.bind(this));
        this.#generateDataCell(this.effectsElement, "Applied Effects", this.#formatBasicStat, "effects", this.handleBasicStatEdit.bind(this));
        this.#generateDataCell(this.notesElement, "Player Notes", this.#formatBasicStat, "notes", this.handleBasicStatEdit.bind(this));
    }

    #generateDataCell(element, label, formatFunct, key, editFunct){
        const rawData = this.getStat(key);
        this.descriptionElement.appendChild(element);
        const labelElement = document.createElement("div");
        labelElement.className = "actionStatLabel";
        labelElement.innerHTML = label;
        element.appendChild(labelElement);

        const valueElement = formatFunct(rawData);
        element.appendChild(valueElement);
        assignEditableTextByElement(valueElement, () => {
            editFunct(valueElement, key);
        })
    }

    #formatBasicStat(stat) {
        const resultElement = document.createElement("div");
        resultElement.className = "actionStatValue";
        resultElement.innerHTML = stat;
        return resultElement;
    }

    #formatAP(costs) {
        const resultElement = document.createElement("div");
        resultElement.className = "actionStatValue";
        let resultStr = "";
        for (let i = 0; i < costs["primary"]; i++){
            resultStr += "\u25c9";
        }
        for (let i = 0; i < costs["secondary"]; i++){
            resultStr += "\u25cb";
        }
        resultElement.innerHTML = resultStr;
        return resultElement;
    }

    #formatRange(stat) {
        const resultElement = document.createElement("div");
        resultElement.className = "actionStatValue";
        resultElement.innerHTML = formatSize(stat);
        return resultElement;
    }

    handleBasicStatEdit(element, statKey) {
        let newText = filterStringForJSON(element.innerHTML);
        if (newText == ""){
            newText = "-";
        }
        this.editBlock.set(statKey, newText);
        this.saveToFile();
    }

    handleCostEdit(element, statKey) {
        logText("cost edit not yet implemented");
    }

    handleRangeEdit(element, statKey) {
        logText("range edit not yet implemented");
    }

    getStat(key){
        if (this.editBlock.has(key)){
            return this.editBlock.get(key);
        } if (this.statBlock.has(key)) {
            return this.statBlock.get(key);
        }
        return "-";
    }

    drawElement(parentElement) {
        parentElement.appendChild(this.descriptionElement);
        this.addEventListeners();
    }

    addEventListeners(){
        logText("Event listeners not yet available.");
    }

    saveToFile() {
        let martialJSON = (
            "{\n\t\"type\": \"Martial\","
            + "\n\t\"category\": \"" + this.category + "\","
            + "\n\t\"name\": \"" + this.name + "\","
            + "\n\t\"statBlock\": " + this.#packageMapForSave(this.statBlock) + ","
            + "\n\t\"editBlock\": " + this.#packageMapForSave(this.editBlock) + ","
            + "\n\t\"skillBlock\": " + this.#packageMapForSave(this.skillBlock)
            +"\n}"
        );
        
        const fileName = formatFileName(this.name);
        saveJSONFile(projectPath + "data/weapons/" + this.category + "/" + fileName + ".json", martialJSON, () => { logText("\tMartial " + fileName + " saved!")});
    }

    #packageMapForSave(map) {
        let result = "{";
        console.log(map);
        for (let key of map.keys()){
            const value = map.get(key);
            console.log(key + " : " + value);
            if (typeof value == "string"){
                result += "\n\t\t\"" + key + "\": \"" + value + "\",";
            } else if (typeof value == "object") {
                //do some different bullshit
                result += "\n\t\t\"" + key + "\": {";
                for (let key2 of value) { //double order key values
                    result += "\n\t\t\t\"" + key2 + "\": " + value[key] + ",";
                }
                result = result.substring(0, result.length - 1);
                result += "\n\t\t},";
            }else{
                result += "\n\t\t\"" + key + "\": " + value + ",";
            }
        }
        result = result.substring(0, result.length - 1); //trim final comma
        result += "\n\t}";
        return result;
    }
}