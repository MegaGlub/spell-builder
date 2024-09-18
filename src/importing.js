import { assignClickableButtonByID, assignClickableButtonByElement } from "./buttons.js";
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
        this.formContainerElement = document.createElement("div");
        this.titleElement = document.createElement("div");
        this.formElement = document.createElement("form");
        this.importCell = document.createElement("span");
        this.importName = document.createElement("label");
        this.importField = document.createElement("input");
        this.submitRow = document.createElement("span");
        this.submitButton = document.createElement("div");
        this.errorBox = document.createElement("div");
    }

    #assignFormElementClasses(){
        this.formContainerElement.className = "modalFormContainer";
        this.titleElement.className = "modalFormTitle";
        this.formElement.className = "modalForm";
        this.importCell.className = "modalFormCell";
        this.importName.className = "modalFormLabel";
        this.importField.className = "modalFormBulkTextField";
        this.submitRow.className = "modalFormRow";
        this.submitButton.className = "modalFormSubmitButton";
        this.errorBox.className = "modalFormErrorBox";
    }

    #assignFormElementIds(){
        this.formContainerElement.id = "importForm";
    }

    #assignInputTypes(){
        this.importField.type = "text";
    }

    #relateFormElements(){
        this.formContainerElement.appendChild(this.titleElement);
        this.formContainerElement.appendChild(this.formElement);
        this.formElement.appendChild(this.importCell);
        this.importCell.appendChild(this.importName);
        this.importCell.appendChild(this.importField);
        this.formElement.appendChild(this.submitRow);
        this.submitRow.appendChild(this.submitButton);
        this.formContainerElement.appendChild(this.errorBox);
    }

    #fillFormInnerHTML(){
        this.importName.innerHTML = "Import Hash:";
    }

    #addEventListeners(){
        assignClickableButtonByElement(this.submitButton, this.#handleSubmission.bind(this));
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
        this.errorBox.appendChild(error);
    }

    #handleSubmission(){

    }

    #decryptHash(){
        
    }
}