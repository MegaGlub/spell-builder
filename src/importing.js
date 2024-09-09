import { assignClickableButtonByID } from "./buttons.js";
import { clearChildren } from "./elementHelpers.js";
import { logText } from "./logging.js";

const modalContent = document.getElementById("modalContent");
const modalBackground = document.getElementById("modalBackground");

let importFormHelper;
export function createImportButton(){
    assignClickableButtonByID("importButton", handleImportPress);
    importFormHelper = new ImportCreator();
}

function handleImportPress(){
    logText("Preparing to import.");
    modalBackground.style.display = "block";
    clearChildren(modalContent);
    importFormHelper.drawElement(modalContent);
}
class ImportCreator {
    constructor() {
        this.#createEmptyFormElements();
        this.#assignFormElementClasses();
        this.#assignFormElementIds();
        this.#assignInputTypes();
        this.#relateFormElements();
        this.#fillFormInnerHTML();
        this.#addEventListeners();
    }

    #createEmptyFormElements(){

    }

    #assignFormElementClasses(){

    }

    #assignFormElementIds(){

    }

    #assignInputTypes(){

    }

    #relateFormElements(){

    }

    #fillFormInnerHTML(){

    }

    #addEventListeners(){
        
    }
}