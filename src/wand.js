import { logText } from "./logging.js";
import { assignToolTip } from "./toolTips.js";
import { assignClickableButtonByID, assignClickableButtonByElement, assignDroppableAreaByElement, assignEditableTextByElement } from "./buttons.js";
import { findComponentByName, componentList } from "../main.js";
import { handleDeleteWandPress } from "./addNewWand.js";
import { clearChildren } from "./elementHelpers.js";
import { saveJSONFile } from "./json.js";

export class wand {
    constructor(name, flavor, image, slotsByName) {
        this.name = name;
        this.flavor = flavor;
        this.image = image;
        this.slotsByName = slotsByName;

        this.slotsByObject = [];

        this.buildWandVisuals();
        logText("Wand built: " + this.name);
    }

    buildWandVisuals() {
        this.#createEmptyElements();
        this.#assignElementClasses();
        this.#assignElementIds();
        this.#assignImage();
        this.#relateElements();
        this.#fillInnerHTML();
        this.updateComponentDisplay();
    }

    #createEmptyElements() {
        this.toolTipButtonElement = document.createElement("div");
        this.wandIconElement = document.createElement("span");
        this.descriptionElement = document.createElement("span");
        this.spellTitleElement = document.createElement("div");
        this.spellTypeElement = document.createElement("div");
        this.spellFlavorElement = document.createElement("div");
        this.imageElement = document.createElement("img");
        this.componentDisplayElement = document.createElement("div");
        this.deleteButtonElement = document.createElement("img");
        this.spellDescriptionElement = document.createElement("div");
        this.wordyDescriptionElement = document.createElement("div");
        this.statsyDescriptionElement = document.createElement("div");
        this.errorBoxDescriptionElement = document.createElement("div");
    }

    #assignElementClasses() {
        this.toolTipButtonElement.className = "toolTipButton";
        this.wandIconElement.className = "wandIcon";
        this.descriptionElement.className = "wandDescription";
        this.spellTitleElement.className = "spellTitle";
        this.spellFlavorElement.className = "spellFlavor";
        this.componentDisplayElement.className = "wandComponentDisplay";
        this.deleteButtonElement.className = "wandDeleteButton";
        this.spellDescriptionElement.className = "wandSpellDescription";
        this.wordyDescriptionElement.className = "wandSpellDescriptionWords";
        this.statsyDescriptionElement.className = "componentStatTable";
    }

    #assignElementIds() {
        this.toolTipButtonElement.id = "wand" + this.name;
        this.descriptionElement.id = "wandDescription" + this.name;
        this.spellDescriptionElement.id = "wandSpellDescription";
    }

    #assignImage() {
        this.imageElement.src = this.image;
        this.deleteButtonElement.src = "images/ui/trash.png";
    }

    #relateElements() {
        this.toolTipButtonElement.appendChild(this.wandIconElement);
        this.wandIconElement.appendChild(this.imageElement);
        this.descriptionElement.appendChild(this.spellTitleElement);
        this.descriptionElement.appendChild(this.spellFlavorElement);
        this.descriptionElement.appendChild(this.componentDisplayElement);
        this.spellDescriptionElement.appendChild(this.wordyDescriptionElement);
        this.spellDescriptionElement.appendChild(this.statsyDescriptionElement);
        this.spellDescriptionElement.appendChild(this.errorBoxDescriptionElement);
    }

    #fillInnerHTML() {
        this.spellTitleElement.innerHTML = this.name;
        this.spellFlavorElement.innerHTML = this.flavor;
        this.componentDisplayElement;
    }

    drawElement(parentElement) {
        parentElement.appendChild(this.toolTipButtonElement);
        this.addEventListeners();
    }

    addEventListeners() {
        assignToolTip(this.toolTipButtonElement, this.descriptionElement);
        assignClickableButtonByID("wand" + this.name, this.selectWand.bind(this)); //the bind is stupid ahhh hell, but it keeps "this" in the right scope
    }

    selectWand() {
        // logText("Selected wand " + this.name + ".");
        const descriptionClone = this.duplicateSelectedDescription();
        this.createDeleteButton(descriptionClone);
        this.beautifySelectedTitle(descriptionClone);
        this.replaceComponentsInClonedDescription(descriptionClone);
        this.#compileSpell();
    }

    duplicateSelectedDescription() {
        const descriptionBox = document.getElementById("wandWorkbench");
        while (descriptionBox.firstChild) {
            descriptionBox.removeChild(descriptionBox.firstChild);
        }
        const descriptionClone = this.descriptionElement.cloneNode(true);
        descriptionBox.appendChild(descriptionClone);
        descriptionClone.id = "descriptionBoxClone";
        return descriptionClone;
    }

    createDeleteButton(descriptionClone) {
        descriptionClone.appendChild(this.deleteButtonElement);
        assignClickableButtonByElement(this.deleteButtonElement, () => {
            handleDeleteWandPress(this.name)
        });
    }

    beautifySelectedTitle(descriptionClone) {
        const activeTitle = descriptionClone.querySelector(".spellTitle");
        activeTitle.classList.replace("spellTitle", "wandActiveTitle");
        assignEditableTextByElement(activeTitle, this.handleNameEdit.bind(this));
        const activeFlavor = descriptionClone.querySelector(".spellFlavor");
        activeFlavor.classList.replace("spellFlavor", "wandActiveFlavor");
        assignEditableTextByElement(activeFlavor, this.handleFlavorEdit.bind(this));
    }

    replaceComponentsInClonedDescription(descriptionClone) {
        const clonedComponentDisplayElement = descriptionClone.querySelector(".wandComponentDisplay");
        clonedComponentDisplayElement.classList.add("wandActiveComponentDisplay");
        clonedComponentDisplayElement.id = "wandActiveComponentDisplay";
        while (clonedComponentDisplayElement.firstChild) {
            clonedComponentDisplayElement.removeChild(clonedComponentDisplayElement.firstChild);
        } //reclone the components so that they get new toolTip listeners
        for (let componentIndex in this.slotsByObject) {
            const componentClone = this.slotsByObject[componentIndex].clone();
            componentClone.toolTipButtonElement.classList.add("wandActiveComponent");
            componentClone.drawElement(clonedComponentDisplayElement);
            assignDroppableAreaByElement(componentClone.toolTipButtonElement, this.handleElementHold.bind(this), this.handleElementDrop.bind(this));
        }
        descriptionClone.appendChild(this.spellDescriptionElement);
    }

    updateComponentDisplay() { //remember to change the slotsByName first!
        while (this.componentDisplayElement.firstChild) { //clear old components
            this.componentDisplayElement.removeChild(this.componentDisplayElement.firstChild);
        }
        var i = 0;
        for (let componentName of this.slotsByName) {
            this.fetchComponentFromList(componentName, i);
            i++;
        }
    }

    fetchComponentFromList(componentName, index) {
        const indexOfComponent = findComponentByName(componentName);
        if (indexOfComponent < 0) {
            logText("Failed to fetch " + componentName + " for wand " + this.name + "!");
        }
        else {
            const componentClone = componentList[indexOfComponent].clone();
            this.slotsByObject[index] = componentClone;
            componentClone.drawElement(this.componentDisplayElement);
        }
    }

    handleElementHold() {
        document.getElementById("wandActiveComponentDisplay").style.backgroundColor = "#B0C4DE";
    }

    handleElementDrop(event) {
        const droppedElementId = event.dataTransfer.getData("text/plain");
        const positionInWand = this.findDroppedPositionInWand(event.clientX, event.clientY);
        this.slotsByName[positionInWand] = droppedElementId.substr(14);
        this.updateComponentDisplay();
        this.selectWand();
        document.getElementById("wandActiveComponentDisplay").style.backgroundColor = "#333333";
    }

    findDroppedPositionInWand(clientX, clientY) { //finds the element by looking at the x coordinate of the drop action
        const descriptionBox = document.getElementById("wandActiveComponentDisplay");
        const availableComponents = [...descriptionBox.querySelectorAll(".wandActiveComponent")]; //converts the array-like into an array after grabbing
        const nearestElement = availableComponents.reduce((nearest, child) => {
            const componentPosition = child.getBoundingClientRect();
            const offsetX = clientX - componentPosition.left - (componentPosition.width / 2);
            const offsetY = clientY - componentPosition.top - (componentPosition.height / 2);
            if (this.isWithinBounds(offsetX, componentPosition.width) && this.isWithinBounds(offsetY, componentPosition.height)) {
                return child;
            } else {
                return nearest;
            }
        }, { offset: Number.POSITIVE_INFINITY });
        for (let i = 0; i < availableComponents.length; i++) { //turns that element into an index in the list
            if (availableComponents[i] == nearestElement) {
                return i;
            }
        }
        return -1;
    }

    isWithinBounds(offset, elementSize) { //finds the element that is within 64 px of the drop position
        return (offset < elementSize / 2 && offset > -(elementSize / 2));
    }

    handleNameEdit() {
        const activeTitle = document.getElementsByClassName("wandActiveTitle")[0];
        const newText = activeTitle.innerHTML;
        this.name = newText;
        this.spellTitleElement.innerHTML = newText;
        this.toolTipButtonElement.id = "wand" + newText;
        this.descriptionElement.id = "wandDescription" + newText;
    }

    handleFlavorEdit() {
        const activeFlavor = document.getElementsByClassName("wandActiveFlavor")[0];
        const newText = activeFlavor.innerHTML;
        this.flavor = newText;
        this.spellFlavorElement.innerHTML = newText;
    }

    #compileSpell() {
        clearChildren(this.wordyDescriptionElement); //clear old children
        const spellBlocks = this.#detectSpellBlocks();
        for (let spellBlock of spellBlocks) {
            if (this.#errorTestSpellBlock(spellBlock)) {
                this.#addDescriptionText("Spell has one or more fatal errors and cannot be compiled.");
            } else { //not terminating errors, just displaying user errors

                let inverted = false;
                const pathComponent = this.#findComponentByType(spellBlock, "Path");
                const formComponent = this.#findComponentByType(spellBlock, "Form");
                const enhancementComponents = this.#findAllComponentsByType(spellBlock, "Enhancement");
                const purposeComponents = this.#findAllComponentsByType(spellBlock, "Purpose");
                const triggerComponent = this.#findComponentByType(spellBlock, "Trigger");

                if (this.#findComponentByType(spellBlock, "Void")) {
                    inverted = true;
                }

                let potency = 0;
                for (let component of spellBlock) {
                    potency += component.potencyModifier;
                }

                this.#addDescriptionText(pathComponent.pathDescription, pathComponent.type);
                this.#addDescriptionText(formComponent.formDescription, formComponent.type);
                if (enhancementComponents.length > 0) {
                    for (let enhancement of enhancementComponents) {
                        this.#addDescriptionText(enhancement.enhancementDescription, enhancement.type);
                    }
                }
                this.#fillPurposeText(purposeComponents, inverted, potency);
                if (triggerComponent) {
                    this.#addDescriptionText(triggerComponent.triggerDescription, triggerComponent.type);
                }
            }
        }
    }

    #detectSpellBlocks() { //TODO separates the spell into multiple blocks, returns an array of arrays with the split component at the front. may require a new component
        return [this.slotsByObject];
    }

    #errorTestSpellBlock(spellBlock) {
        this.#clearErrors();
        const voidComponent = this.#findComponentByType(spellBlock, "Void");
        const pathComponent = this.#findComponentByType(spellBlock, "Path");
        const formComponent = this.#findComponentByType(spellBlock, "Form");
        const purposeComponents = this.#findAllComponentsByType(spellBlock, "Purpose");

        let fatalErrors = false;

        if (!pathComponent){
            this.#addError(true, "A spell block requires a Path component!");
            fatalErrors = true;
        }
        if (!formComponent){
            this.#addError(true, "A spell block requires a Form component!");
            fatalErrors = true;
        }
        if (purposeComponents.length == 0){
            this.#addError(true, "A spell block requires at least one Purpose component!");
            fatalErrors = true;
        }
        if (!this.#allPurposeComponentsAreInvertible(purposeComponents) && voidComponent && purposeComponents.length != 0){
            this.#addError(false, "A spell block includes a \"Nothing\", but one or more of its Purposes are not invertible and unaffected.");
        }
        if (spellBlock.length > 7) {
            this.#addError(false, "One or more spell blocks are quite long. This may result in goofy displays or extremely high mana costs.");
        }
        if (this.#findAllComponentsByType(spellBlock, "Trigger").length > 1){
            this.#addError(true, "A spell block may only contain up to one Trigger!");
            fatalErrors = true;
        }
        if (this.#findAllComponentsByType(spellBlock, "Path").length > 1){
            this.#addError(true, "A spell block may only contain up to one Path!");
            fatalErrors = true;
        }
        if (this.#findAllComponentsByType(spellBlock, "Form").length > 1){
            this.#addError(true, "A spell block may only contain up to one Form!");
            fatalErrors = true;
        }

        return fatalErrors;
    }

    #clearErrors(){
        clearChildren(this.errorBoxDescriptionElement);
    }

    #addError(fatal, text){
        const error = document.createElement("div");
        const icon = document.createElement("img");
        const errorMsg = document.createElement("div");
        error.className = "modalFormError";
        icon.className = "errorIcon";
        errorMsg.className = "modalFormErrorMessage";
        if (fatal){
            icon.src = "images/ui/red-error.png";
        } else{
            icon.src = "images/ui/yellow-error.png";
        }
        errorMsg.innerHTML = text;
        error.appendChild(icon);
        error.appendChild(errorMsg);
        this.errorBoxDescriptionElement.appendChild(error);
    }

    #findComponentByType(spellBlock, type) {
        for (let component of spellBlock) {
            if (component.type == type) {
                return component;
            }
        }
    }

    #findAllComponentsByType(spellBlock, type) {
        const result = [];
        for (let component of spellBlock) {
            if (component.type == type) {
                result.push(component);
            }
        }
        return result;
    }

    #allPurposeComponentsAreInvertible(purposeComponents) {
        let result = true;
        for (let purpose of purposeComponents){
            if (purpose.invertible == "false"){ //typeless (but not *actually* typeless) my beloathed
                result = false;
            }
        }
        return result;
    }

    #fillPurposeText(purposeComponents, inverted, potency) {
        for (let i = 0; i < purposeComponents.length - 1; i++){
            this.#addPurposeToText(purposeComponents[i], inverted, potency);
            this.#addDescriptionText(" and ");
        }
        this.#addPurposeToText(purposeComponents[purposeComponents.length - 1], inverted, potency);
        this.#addDescriptionText(". ");
    }

    #addPurposeToText(purpose, inverted, potency){ //beautifying the text using colored spans might be a good idea. maybe change it from innerHTML?
        if (purpose.invertible == "true" && inverted){ //purpose.invertible is being stored as a string
            if (potency <= -2){
                this.#addDescriptionText(purpose.purposeDescriptions["invHigh"], purpose.type, purpose.primaryType);
            } else if (potency <= 1){
                this.#addDescriptionText(purpose.purposeDescriptions["invMid"], purpose.type, purpose.primaryType);
            } else{
                this.#addDescriptionText(purpose.purposeDescriptions["invLow"], purpose.type, purpose.primaryType);
            }
        } else{
            if (potency >= 2){
                this.#addDescriptionText(purpose.purposeDescriptions["high"], purpose.type, purpose.primaryType);
            } else if (potency >= -1){
                this.#addDescriptionText(purpose.purposeDescriptions["mid"], purpose.type, purpose.primaryType);
            } else{
                this.#addDescriptionText(purpose.purposeDescriptions["low"], purpose.type, purpose.primaryType);
            }
        }
    }

    #addDescriptionText(text, componentType, specifier){ //specifier is optional, -1 when not in use
        const textElement = document.createElement("span");
        if (componentType){
            textElement.style.color = this.#getDescriptionColor(componentType);
        }
        if (specifier){
            const underlineColor = this.#getDescriptionUnderlineColor(specifier);
            textElement.style.textDecoration = "underline " + underlineColor;
        }
        textElement.innerHTML = text;
        //textElement.className = "";

        this.wordyDescriptionElement.appendChild(textElement);
    }

    #getDescriptionColor(type){
        switch(type){
            case "Void":
                return "#8A2BE2";
            case "Form":
                return "#3CB371";
            case "Path":
                return "#DAA520";
            case "Purpose":
                return "#A0AECD";
            case "Enhancement":
                return "#6495ED";
            case "Refund":
                return "#BC8F8F";
            case "Trigger":
                return "#FA8072";
            default:
                return "#000000";
        }
    }

    #getDescriptionUnderlineColor(vis){
        switch(vis){
            case "Design":
                return "#DBA463";
            case "Nature":
                return "#3CB371";
            case "Eath":
                return "#5A4E44";
            case "Flesh":
                return "#E86A73";
            case "Heat":
                return "#B4202A";
            case "Flow":
                return "#588DBE";
            default:
                logText("Underline color for wand description failed, defaulting to black");
                return "#000000";
        }
    }

    saveToFile() {
        let wandJSON = (
            "{\"type\": \"Wand\","
            + "\"name\": \"" + this.name + "\","
            + "\"flavor\": \"" + this.flavor + "\","
            + "\"image\": \"" + this.image + "\","
            + "\"slots\": " + JSON.stringify(this.slotsByName)
        );

        let fileName = this.name;
        fileName = fileName.replaceAll("[^A-Za-z0-9]", "");
        fileName = fileName.replaceAll(" ", "-");
        fileName = fileName.toLowerCase();

        saveJSONFile(wandJSON, "data/wands/" + fileName, () => {logText("Wand " + fileName + " saved!")});
    }
}