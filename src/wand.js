import { logText } from "./logging.js";
import { assignToolTip } from "./toolTips.js";
import { assignClickableButtonByID, assignDroppableAreaByID } from "./buttons.js";
import { componentList, detectComponentByName } from "../main.js";
export class wand {
    constructor(name, flavor, image, slots) {
        this.name = name;
        this.flavor = flavor;
        this.image = image;
        this.slots = slots;

        console.log(this.slots);

        this.buildWandVisuals();
        assignToolTip(this.toolTipButtonElement, this.descriptionElement);
        this.drawElement(document.getElementById("wandSelector"));
        assignClickableButtonByID("wand" + this.name, this.selectWand.bind(this)); //the bind is stupid ahhh hell, but it keeps "this" in the right scope
        logText("Wand built: " + this.name);
    }

    buildWandVisuals() {
        this.#createEmptyElements();
        this.#assignElementClasses();
        this.#assignElementIds();
        this.#assignImage();
        this.#relateElements();
        this.#fillInnerHTML();
        this.#updateComponentDisplay();
    }

    #createEmptyElements() {
        this.toolTipButtonElement = document.createElement("div");
        this.descriptionElement = document.createElement("span");this.spellTitleElement = document.createElement("div");
        this.spellTypeElement = document.createElement("div");
        this.spellFlavorElement = document.createElement("div");
        this.imageElement = document.createElement("img");
        this.componentDisplayElement = document.createElement("div");
    }

    #assignElementClasses() {
        this.toolTipButtonElement.className = "toolTipButton";
        this.descriptionElement.className = "wandDescription";
        this.spellTitleElement.className = "spellTitle";
        this.spellFlavorElement.className = "spellFlavor";
        this.componentDisplayElement.className = "wandComponentDisplay";
    }

    #assignElementIds() {
        this.toolTipButtonElement.id = "wand" + this.name;
        this.descriptionElement.id = "wandDescription" + this.name;
    }

    #assignImage() {
        this.imageElement.src = this.image;
    }

    #relateElements() {
        this.toolTipButtonElement.appendChild(this.imageElement);
        this.descriptionElement.appendChild(this.spellTitleElement);
        this.descriptionElement.appendChild(this.spellFlavorElement);
        this.descriptionElement.appendChild(this.componentDisplayElement);
    }

    #fillInnerHTML() {
        this.spellTitleElement.innerHTML = "\"" + this.name + "\"";
        this.spellFlavorElement.innerHTML = this.flavor;
        this.componentDisplayElement;
    }

    drawElement(parentElement) {
        parentElement.appendChild(this.toolTipButtonElement);
    }

    selectWand() {
        const descriptionBox = document.getElementById("wandWorkbench");
        while (descriptionBox.firstChild) {
            descriptionBox.removeChild(descriptionBox.firstChild);
        }
        descriptionBox.appendChild(this.descriptionElement.cloneNode(true));
    }

    #updateComponentDisplay() { //remember to change the slots first!
        while (this.componentDisplayElement.firstChild) { //clear old components
            this.componentDisplayElement.removeChild(this.componentDisplayElement.firstChild);
        }
        var i = 0;
        for (let componentName of this.slots) {
            this.#fetchComponentFromList(componentName, i);
            i++;
        }
    }

    #fetchComponentFromList(componentName, index){
        if (detectComponentByName(componentName)){
            const clonableComponent = document.getElementById("spellComponent" + componentName);
            const clone = clonableComponent.cloneNode(true);
            clone.id = clone.id + index;
            assignDroppableAreaByID(clone, this.handleHoldingElement.bind(this), this.handleElementDrop.bind(this));
            this.componentDisplayElement.appendChild(clonableComponent.cloneNode(true));
        } else{
            logText("Failed to fetch " + componentName + " for wand " + this.name + "!");
        }
    }

    handleHoldingElement(){
        this.componentDisplayElement.style.backgroundColor = "#B0C4DE";
    }

    handleElementDrop(event){
        const droppedElementId = event.dataTransfer.getData("text/plain");
        const positionInWand = 0; //FIX ME!!!!!!
        this.slots[positionInWand] = droppedElementId;
        this.#updateComponentDisplay();
        this.componentDisplayElement.style.backgroundColor = "#333333";
    }
}

