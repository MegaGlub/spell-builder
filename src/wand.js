import { logText } from "./logging.js";
import { assignToolTip } from "./toolTips.js";
import { assignClickableButtonByID, assignDroppableAreaByElement } from "./buttons.js";
import { detectComponentByName } from "../main.js";
export class wand {
    constructor(name, flavor, image, slots) {
        this.name = name;
        this.flavor = flavor;
        this.image = image;
        this.slots = slots;

        console.log(this.slots);

        this.buildWandVisuals();
        this.drawElement(document.getElementById("wandSelector"));
        this.addEventListeners();
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

    addEventListeners(){
        assignToolTip(this.toolTipButtonElement, this.descriptionElement);
        assignClickableButtonByID("wand" + this.name, this.selectWand.bind(this)); //the bind is stupid ahhh hell, but it keeps "this" in the right scope
    }

    selectWand() {
        logText("Selected wand " + this.name + ".");
        const descriptionBox = document.getElementById("wandWorkbench");
        while (descriptionBox.firstChild) {
            descriptionBox.removeChild(descriptionBox.firstChild);
        }
        const clone = this.descriptionElement.cloneNode(true);
        descriptionBox.appendChild(clone);
        const children = clone.childNodes;
        for (let i in children){
            const child = children[i]
            console.log(child);
            if (child.className == "wandComponentDisplay"){
                child.addEventListeners();
            }
        }
    }

    updateComponentDisplay() { //remember to change the slots first!
        while (this.componentDisplayElement.firstChild) { //clear old components
            this.componentDisplayElement.removeChild(this.componentDisplayElement.firstChild);
        }
        var i = 0;
        for (let componentName of this.slots) {
            this.fetchComponentFromList(componentName, i);
            i++;
        }
    }

    fetchComponentFromList(componentName, index){
        if (detectComponentByName(componentName)){
            const clonableComponent = document.getElementById("spellComponent" + componentName);
            const clone = clonableComponent.cloneNode(true);
            clone.id = clone.id + index;
            this.componentDisplayElement.appendChild(clone);
            assignDroppableAreaByElement(clone, this.handleElementHold.bind(this), this.handleElementDrop.bind(this));
        } else{
            logText("Failed to fetch " + componentName + " for wand " + this.name + "!");
        }
    }

    handleElementHold(){
        logText("component hold detected!");
        this.componentDisplayElement.style.backgroundColor = "#B0C4DE";
    }

    handleElementDrop(event){
        logText("component drop detected!");
        const droppedElementId = event.dataTransfer.getData("text/plain");
        const positionInWand = 0; //FIX ME!!!!!!
        this.slots[positionInWand] = droppedElementId;
        this.updateComponentDisplay();
        this.selectWand();
        this.componentDisplayElement.style.backgroundColor = "#333333";
    }
}

