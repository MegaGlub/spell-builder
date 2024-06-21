import { logText } from "./logging.js";
import { assignToolTip } from "./toolTips.js";
import { assignClickableButtonByID } from "./buttons.js";
export class wand {
    constructor(name, image, slots) {
        this.name = name;
        this.image = image;
        this.slots = slots;

        this.buildWandVisuals();
        assignToolTip(this.toolTipButtonElement);
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
    }

    #createEmptyElements() {
        this.toolTipButtonElement = document.createElement("div");
        this.toolTipElement = document.createElement("div");
        this.imageElement = document.createElement("img");
        this.descriptionElement = document.createElement("span");
        this.titleElement = document.createElement("div");
    }

    #assignElementClasses() {
        this.toolTipButtonElement.className = "toolTipButton";
        this.toolTipElement.className = "toolTip";
        this.descriptionElement.className = "wandDescription";
        this.titleElement.className = "wandTitle";
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
        this.toolTipButtonElement.appendChild(this.toolTipElement);
        this.toolTipElement.appendChild(this.descriptionElement);
        this.descriptionElement.appendChild(this.titleElement);
    }

    #fillInnerHTML() {
        this.titleElement.innerHTML = "\"" + this.name + "\"";
    }

    drawElement(parentElement) {
        parentElement.appendChild(this.toolTipButtonElement);
    }

    selectWand(){
        const descriptionBox = document.getElementById("wandWorkbench");
        while (descriptionBox.firstChild) {
            descriptionBox.removeChild(descriptionBox.firstChild);
        }
        descriptionBox.appendChild(this.descriptionElement.cloneNode(true));
    }
}

