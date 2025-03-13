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
        this.descriptionElement.spellcheck = "false";
        this.#fillStatTable();
    }

    #fillStatTable(){
        this.#generateDataCell(this.requirementElement, "Requirements", this.#formatBasicStat, "requirements", this.assignBasicStatEditable, "Required status, stance, or secondary costs to use this ability.");
        this.#generateDataCell(this.damageElement, "Damage", this.#formatBasicStat, "damage", this.assignBasicStatEditable, "Formula for the Damage Roll of the attack.");
        this.#generateDataCell(this.toHitElement, "To-Hit", this.#formatBasicStat, "toHit", this.assignBasicStatEditable, "Formula for the To-Hit Roll of the attack.");
        this.#generateDataCell(this.costElement, "Cost", this.#formatAP, "cost", this.assignCostStatEditable, "Action point cost to use the attack.<br>(\u25c9: Primary, \u25cb: Secondary)");
        this.#generateDataCell(this.rangeElement, "Range", this.#formatRange, "range", this.assignBasicStatEditable, "Range of the attack.<br>(Note that anything less than 3m will generally be considered adjacent only.)");
        this.#generateDataCell(this.effectsElement, "Applied Effects", this.#formatBasicStat, "effects", this.assignBasicStatEditable, "Effects applied to yourself, enemies, or nearby allies on use.");
        this.#generateDataCell(this.notesElement, "Player Notes", this.#formatBasicStat, "notes", this.assignBasicStatEditable, "Write notes for yourself on use-cases or clarifications.");
    }

    #generateDataCell(element, label, formatFunct, key, editFunct, toolTipText){
        const rawData = this.getStat(key);
        this.descriptionElement.appendChild(element);
        const labelElement = document.createElement("div");
        labelElement.className = "actionStatLabel";
        labelElement.innerHTML = label;
        element.appendChild(labelElement);

        const valueElement = formatFunct(rawData);
        element.appendChild(valueElement);
        editFunct(valueElement, key);

        const toolTip = document.createElement("span");
        toolTip.innerHTML = toolTipText;
        assignToolTip(element, toolTip);
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
        if (typeof stat == "string"){
            resultElement.innerHTML = stat;
        } else{
            resultElement.innerHTML = formatSize(stat);
        }
        return resultElement;
    }

    assignBasicStatEditable(element, key){
        const editFunct = this.handleBasicStatEdit.bind(this);
        assignEditableTextByElement(element, () => {
            editFunct(element, key);
        });
    }

    assignCostStatEditable(element, key){
        logText("lmao, this cost stat cannot be editted");
    }

    handleBasicStatEdit(element, statKey) {
        let newText = filterStringForJSON(element.innerHTML);
        if (newText == ""){
            newText = "-";
        }
        this.editBlock.set(statKey, newText);
        this.saveToFile();
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
        const revertToolTip = document.createElement("span");
        revertToolTip.innerHTML = "Revert edits to default.<br>(Does not revert notes)";
        assignToolTip(this.revertButtonElement, revertToolTip);
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
        for (const [key, value] of map.entries()){
            console.log(key + " : " + typeof value);
            if (typeof value == "string"){
                result += "\n\t\t\"" + key + "\": \"" + value + "\",";
            } else if (typeof value == "object") { //aka a map within a map, such as for cost
                result += "\n\t\t\"" + key + "\": {";
                for (const [key2, value2] of Object.entries(value)) { //double order key values
                    result += "\n\t\t\t\"" + key2 + "\": " + value2 + ",";
                }
                result = result.substring(0, result.length - 1); //comma trim
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