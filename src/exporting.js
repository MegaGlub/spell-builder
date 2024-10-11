import { assignClickableButtonByID, assignClickableButtonByElement, hideModal } from "./buttons.js";
import { clearChildren } from "./elementHelpers.js";
import { logText } from "./logging.js";
import { encryption_key, savedComponentNames, valid_crypto_sign } from "../main.js";

// const SimpleCrypto = window.ballfish.require('simple-crypto-js');
// SimpleCrypto.default;

const modalContent = document.getElementById("modalContent");
const modalBackground = document.getElementById("modalBackground");

let exportFormHelper;
export function createExportButton() {
    assignClickableButtonByID("exportButton", handleExportPress);
    exportFormHelper = new ExportCreator();
}

function handleExportPress() {
    logText("Preparing to export.");
    modalBackground.style.display = "block";
    clearChildren(modalContent);
    exportFormHelper.drawElement(modalContent);
}

class ExportCreator {
    constructor() {
        this.#createEmptyFormElements();
        this.#assignFormElementClasses();
        this.#assignFormElementIds();
        this.#assignInputTypes();
        this.#relateFormElements();
        this.#fillFormInnerHTML();
        this.#fillDefualtValues();
        this.#addEventListeners();
    }

    #createEmptyFormElements() {
        this.formContainerElement = document.createElement("div");
        this.titleElement = document.createElement("div");
        this.formElement = document.createElement("form");
        this.exportCell = document.createElement("span");
        this.exportName = document.createElement("label");
        this.exportField = document.createElement("textarea");
        this.submitRow = document.createElement("span");
        this.submitButton = document.createElement("div");
        this.errorBox = document.createElement("div");
    }

    #assignFormElementClasses() {
        this.formContainerElement.className = "modalFormContainer";
        this.titleElement.className = "modalFormTitle";
        this.formElement.className = "modalForm";
        this.exportCell.className = "modalFormCell";
        this.exportName.className = "modalFormLabel";
        this.exportField.className = "modalFormBulkTextField";
        this.submitRow.className = "modalFormRow";
        this.submitButton.className = "modalFormSubmitButton";
        this.errorBox.className = "modalFormErrorBox";
    }

    #assignFormElementIds() {
        this.formContainerElement.id = "exportForm";
    }

    #assignInputTypes() {
        // this.exportField.type = "textarea";
    }

    #relateFormElements() {
        this.formContainerElement.appendChild(this.titleElement);
        this.formContainerElement.appendChild(this.formElement);
        this.formElement.appendChild(this.exportCell);
        this.exportCell.appendChild(this.exportName);
        this.exportCell.appendChild(this.exportField);
        this.formElement.appendChild(this.submitRow);
        this.submitRow.appendChild(this.submitButton);
        this.formContainerElement.appendChild(this.errorBox);
    }

    #fillFormInnerHTML() {
        this.titleElement.innerHTML = "Export Your Components";
        this.exportName.innerHTML = "Code";
        this.submitButton.innerHTML = "Generate";
    }

    #fillDefualtValues() {
        this.exportField.value = " Press the button below to generate a new import code, then copy it and send it to somebody else to share your known components.\n Please only so with explicit DM approval.";
    }

    #addEventListeners() {
        assignClickableButtonByElement(this.submitButton, this.#handleSubmission.bind(this));
    }

    drawElement(parentElement) {
        parentElement.appendChild(this.formContainerElement);
    }

    #addError(fatal, text) {
        const error = document.createElement("div");
        const icon = document.createElement("img");
        const errorMsg = document.createElement("div");
        error.className = "modalFormError";
        icon.className = "errorIcon";
        errorMsg.className = "modalFormErrorMessage";
        if (fatal) {
            icon.src = "images/ui/red-error.png";
        } else {
            icon.src = "images/ui/yellow-error.png";
        }
        errorMsg.innerHTML = text;
        error.appendChild(icon);
        error.appendChild(errorMsg);
        this.errorBox.appendChild(error);
    }

    #handleSubmission(){
        let output = this.#preformatOutput();
        output = this.#encryptHash(output);
        this.exportField.value = output;
    }

    #preformatOutput(){
        let result = valid_crypto_sign;
        for (let str of savedComponentNames){
            result += "|" + str;
        }
        return result;
    }

    #encryptHash(msg){
        const encryptedMsg = window.ballfish.encrypt(encryption_key, msg);
        return encryptedMsg;
    }
}