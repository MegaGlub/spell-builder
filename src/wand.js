import { logText } from "./logging.js";
import { assignToolTip } from "./toolTips.js";
export class wand {
    constructor(name, image, slots) {
        this.name = name;
        this.image = image;
        this.slots = slots;

        this.buildWandVisuals();
        assignToolTip(this.toolTipButtonElement);
        this.drawElement(document.getElementById("wandSelector"));
    }

    buildWandVisuals() {
        this.#createEmptyElements();
        this.#assignElementClasses();
        this.#assignElementIds();
        this.#assignImage();
        this.#relateElements();
        this.#fillInnerHTML();
    }

    #createEmptyElements() {
        this.toolTipButtonElement = document.createElement("div");
        this.toolTipElement = document.createElement("div");
        this.imageElement = document.createElement("img");
    }

    #assignElementClasses() {
        this.toolTipButtonElement.className = "toolTipButton";
        this.toolTipElement.className = "toolTip";
    }

    #assignElementIds() {
        this.toolTipButtonElement.id = "wand" + this.name;
    }

    #assignImage() {
        this.imageElement.src = this.image;
    }

    #relateElements() {
        this.toolTipButtonElement.appendChild(this.imageElement);
        this.toolTipButtonElement.appendChild(this.toolTipElement);
    }

    #fillInnerHTML(){
        this.toolTipElement.innerHTML = this.name;
    }

    drawElement(parentElement) {
        parentElement.appendChild(this.toolTipButtonElement);
    }

    selectWand(descriptionBox){
        while (descriptionBox.firstChild) {
            descriptionBox.removeChild(descriptionBox.firstChild);
        }
        descriptionBox.appendChild(this.descriptionElement);
    }
}