import { logText } from "./logging.js";
import { assignToolTip } from "./toolTips.js";
export class wand {
    constructor(name, image, slots) {
        this.name = name;
        this.image = image;
        this.slots = slots;

        this.buildWandVisuals();
        assignToolTip(this.toolTipButtonElement);
    }

    buildWandVisuals() {
        this.#createEmptyElements();
        this.#assignElementClasses();
        this.#assignElementIds();
        this.#assignImage();
        this.#relateElements();
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
}