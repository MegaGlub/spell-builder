import { logText } from "./logging.js";
import { assignToolTip } from "./toolTips.js";
import { assignClickableButtonByID, assignClickableButtonByElement, assignDroppableAreaByElement, assignEditableTextByElement } from "./buttons.js";
import { findComponentByName, componentList, setSelectedWand, projectPath } from "../main.js";
import { handleDeleteWandPress } from "./addNewWand.js";
import { clearChildren } from "./elementHelpers.js";
import { formatFileName, saveJSONFile } from "./json.js";
import { spellBlock } from "./spellBlock.js";
import { deleteWandCookie } from "./cookies.js";

export class wand {
    constructor(name, flavor, image, slotsByName) {
        this.name = name;
        this.flavor = flavor;
        this.image = image;
        this.slotsByName = slotsByName;
        this.spellBlockCount = 0;

        this.slotsByObject = [];

        this.buildWandVisuals();
        logText("\tWand built: " + this.name + ".");
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
        this.wandElement = document.createElement("span");
        this.descriptionElement = document.createElement("span");
        this.spellTitleElement = document.createElement("div");
        this.spellTypeElement = document.createElement("div");
        this.spellFlavorElement = document.createElement("div");
        this.imageElement = document.createElement("img");
        this.componentDisplayElement = document.createElement("div");
        this.deleteButtonElement = document.createElement("img");
        this.spellDescriptionElement = document.createElement("div");
        this.errorBoxDescriptionElement = document.createElement("div");
    }

    #assignElementClasses() {
        this.wandElement.className = "wandIcon";
        this.descriptionElement.className = "wandDescription";
        this.spellTitleElement.className = "spellTitle";
        this.spellFlavorElement.className = "spellFlavor";
        this.componentDisplayElement.className = "wandComponentDisplay";
        this.deleteButtonElement.className = "wandDeleteButton";
        this.spellDescriptionElement.className = "wandSpellDescription";
        this.errorBoxDescriptionElement.className = "wandSpellDescriptionErrors";
    }

    #assignElementIds() {
        this.wandElement.id = "wand" + this.name;
        this.descriptionElement.id = "wandDescription" + this.name;
        this.spellDescriptionElement.id = "wandSpellDescription";
    }

    #assignImage() {
        this.imageElement.src = this.image;
        this.deleteButtonElement.src = "images/ui/trash.png";
    }

    #relateElements() {
        this.wandElement.appendChild(this.imageElement);
        this.descriptionElement.appendChild(this.spellTitleElement);
        this.descriptionElement.appendChild(this.spellFlavorElement);
        this.descriptionElement.appendChild(this.componentDisplayElement);
        this.spellDescriptionElement.appendChild(this.errorBoxDescriptionElement);
    }

    #fillInnerHTML() {
        this.spellTitleElement.innerHTML = this.name;
        this.spellFlavorElement.innerHTML = this.flavor;
        this.componentDisplayElement;
    }

    drawElement(parentElement) {
        parentElement.appendChild(this.wandElement);
        this.addEventListeners();
    }

    addEventListeners() {
        assignToolTip(this.wandElement, this.descriptionElement);
        assignClickableButtonByID("wand" + this.name, this.selectWand.bind(this)); //the bind is stupid ahhh hell, but it keeps "this" in the right scope
    }

    selectWand() {
        // logText("Selected wand " + this.name + ".");
        const descriptionClone = this.duplicateSelectedDescription();
        this.createDeleteButton(descriptionClone);
        this.beautifySelectedTitle(descriptionClone);
        this.replaceComponentsInClonedDescription(descriptionClone);
        this.#compileSpell();
        setSelectedWand(this);
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
            componentClone.componentElement.classList.add("wandActiveComponent");
            componentClone.drawElement(clonedComponentDisplayElement);
            assignDroppableAreaByElement(componentClone.componentElement, this.handleElementHold.bind(this), this.handleElementDrop.bind(this));
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
        this.saveToFile();
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
        const oldText = this.name;
        this.name = newText;
        this.spellTitleElement.innerHTML = newText;
        this.wandElement.id = "wand" + newText;
        this.descriptionElement.id = "wandDescription" + newText;
        deleteWandCookie(oldText);
        this.saveToFile();
    }

    handleFlavorEdit() {
        const activeFlavor = document.getElementsByClassName("wandActiveFlavor")[0];
        const newText = activeFlavor.innerHTML;
        this.flavor = newText;
        this.spellFlavorElement.innerHTML = newText;
        this.saveToFile();
    }

    #compileSpell() {
        clearChildren(this.spellDescriptionElement);
        const nonCompiledSpellBlocks = this.#detectSpellBlocks();
        let positionInWand = 1;
        for (let spellCollection of nonCompiledSpellBlocks) {
            let blockBranch;
            if (this.spellBlockCount >= 1){
                blockBranch = this.#generateDescriptionElement("wandSpellDescriptionBranch");
            }
            const blockDescription = this.#generateDescriptionElement("wandSpellDescriptionWords"); //just the container
            const blockStats = this.#generateDescriptionElement("componentStatTable"); //just generates the container, not the table itself
            blockStats.classList.add("wandSpellDescriptionStats");
            const block = new spellBlock(spellCollection, positionInWand, blockBranch, blockDescription, blockStats, this.errorBoxDescriptionElement);
            positionInWand += spellCollection.length;
            block.compileSpell();
            this.spellBlockCount++;
        }
        this.spellDescriptionElement.appendChild(this.errorBoxDescriptionElement);
        this.spellBlockCount = 0;
        this.saveToFile();
    }

    #detectSpellBlocks() { //TODO separates the spell into multiple blocks, returns an array of arrays with the split component at the front. may require a new component
        const result = [];
        let tempArr = [];
        for (let i = 0; i < this.slotsByObject.length; i++){
            if (this.slotsByObject[i].type == "Branch"){
                result.push(tempArr);
                tempArr = [];
            }
            tempArr.push(this.slotsByObject[i]);
        }
        result.push(tempArr);
        return result;
    }

    #generateDescriptionElement(cssClass){
        const result = document.createElement("span");
        result.className = cssClass;
        this.spellDescriptionElement.appendChild(result);
        return result;
    }

    saveToFile() {
        let wandJSON = (
            "{\n\t\"type\": \"Wand\","
            + "\n\t\"name\": \"" + this.name + "\","
            + "\n\t\"flavor\": \"" + this.flavor + "\","
            + "\n\t\"image\": \"" + this.image + "\","
            + "\n\t\"slots\": " + this.#packageComponentsForSave()
            + "\n}"
        );

        const fileName = formatFileName(this.name);
        saveJSONFile(projectPath + "data/wands/" + fileName + ".json", wandJSON, () => {logText("\tWand " + fileName + " saved!")});
    }

    #packageComponentsForSave(){
        let result = "[";
        for (let i = 0; i < this.slotsByName.length - 1; i++){
            result += "\n\t\t\"" + this.slotsByName[i] + "\",";
        }
        result += "\n\t\t\"" + this.slotsByName[this.slotsByName.length - 1] + "\"";
        result += "\n\t]";
        return result;
    }
}