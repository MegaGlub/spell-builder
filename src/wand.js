import { logText } from "./logging.js";
import { assignToolTip } from "./toolTips.js";
import { assignClickableButtonByID, assignClickableButtonByElement, assignDroppableAreaByElement, assignEditableTextByElement } from "./buttons.js";
import { findComponentByName, componentList } from "../main.js";
import { handleDeleteWandPress } from "./addNewWand.js";

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
        this.spellDescriptionElement = document.createElement("span");
        this.wordyDescriptionElement = document.createElement("div");
        this.statsyDescriptionElement = document.createElement("div");
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
        const spellBlocks = this.#detectSpellBlocks();
        for (let spellBlock of spellBlocks) {
            if (this.#errorTestSpellBlock(spellBlock)) {
                return;
            } else { //not terminating errors, just displaying user errors
                let inverted = false;
                const pathComponent = this.#findComponentByType(spellBlock, "Path");
                const formComponent = this.#findComponentByType(spellBlock, "Form");
                const enhancementComponents = this.#findAllComponentsByType(spellBlock, "Enhancement");
                const purposeComponents = this.#findAllComponentsByType(spellBlock, "Purpose");
                const triggerComponent = this.#findComponentByType(spellBlock, "Trigger");

                if (this.#findComponentByType(spellBlock, "Void") && this.#allPurposeComponentsAreInvertible(purposeComponents)) {
                    inverted = true;
                }

                let potency = 0;
                for (let component of spellBlock) {
                    potency += component.potencyModifier;
                }

                console.log(pathComponent);
                this.wordyDescriptionElement.innerHTML = pathComponent.pathDescription;
                console.log("path description: " + pathComponent.pathDescription); 
                this.wordyDescriptionElement.innerHTML += formComponent.formDescription;
                if (this.enhancementComponents) {
                    for (let enhancement of enhancementComponents) {
                        this.wordyDescriptionElement.innerHTML += enhancement.enhancementDescription;
                    }
                }
                this.#fillPurposeText(purposeComponents, potency, inverted);
                if (triggerComponent) {
                    this.wordyDescriptionElement.innerHTML += triggerComponent.triggerDescription;
                }
            }
        }
        this.#removeOldCompiledSpell();
        document.getElementById("descriptionBoxClone").appendChild(this.spellDescriptionElement);
    }

    #detectSpellBlocks() { //TODO separates the spell into multiple blocks, returns an array of arrays with the split component at the front
        return [this.slotsByObject];
    }

    #errorTestSpellBlock(spellBlock) { //TODO
        return false;
    }

    #findComponentByType(spellBlock, type) { //TODO
        for (let component of spellBlock) {
            if (component.type == type) {
                return component;
            }
        }
    }

    #findAllComponentsByType(spellBlock, type) { //TODO, for enhancements
        const result = [];
        for (let component of spellBlock){
            if (component.type == type) {
                result.push(component);
            }
        }
        return result;
    }

    #allPurposeComponentsAreInvertible(purposeComponents) {
        return true;
    }

    #fillPurposeText() {
        this.wordyDescriptionElement.innerHTML += "purpose text here";
        return;
    }

    #removeOldCompiledSpell() {
        const descriptionClone = document.getElementById("descriptionBoxClone");
        const preExistingCompiledSpell = descriptionClone.querySelector(".wandSpellDescription");
        if (preExistingCompiledSpell) {
            descriptionClone.removeChild(preExistingCompiledSpell);
        }
    }
}