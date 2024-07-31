import { assignClickableButtonByID } from "./buttons.js";
import { logText } from "./logging.js";

const modalContent = document.getElementById("modalContent");
const modalBackground = document.getElementById("modalBackground");
let wandFormHelper;

export function createWandAddButton() {
    const wandAddButton = document.getElementById("wandAddButton");
    wandAddButton.src = "images/ui/add.png";
    assignClickableButtonByID("wandAddButton", handleOpenAddPress);
    wandFormHelper = new wandFormCreator();
}

function handleOpenAddPress(){
    logText("Preparing to add new wand.");
    modalBackground.style.display = "block";
    while(modalContent.firstChild) {
        modalContent.removeChild(modalContent.firstChild);
    }
    wandFormHelper.drawElement(modalContent);
}

class wandFormCreator {
    constructor(){
        this.#createEmptyFormElements();
        this.#assignFormElementClasses();
        this.#assignFormElementIds();
        this.#relateFormElements();
        this.#fillFormInnerHTML();
    }

    #createEmptyFormElements(){
        this.formElement = document.createElement("div");
        this.titleElement = document.createElement("div");
        this.fieldContainerElement = document.createElement("form"); //flexbox?
        this.nameLabel = document.createElement("label");
        this.nameField = document.createElement("input");
        this.flavorLabel = document.createElement("label");
        this.flavorField = document.createElement("input");
        this.slotsLabel = document.createElement("label");
        this.slotsField = document.createElement("input");
        this.imageLabel = document.createElement("label");
        this.imageField = document.createElement("input");
        this.customImageField = document.createElement("input");
        this.submitButton = document.createElement("input");
    }
    
    #assignFormElementClasses(){
        this.formElement.className = "modalForm";
        this.titleElement.className = "modalFormTitle";
        this.fieldContainerElement.className = "modalFormFieldContainer";
        this.nameLabel.className = "modalFormLabel";
        this.flavorLabel.className = "modalFormLabel";
        this.slotsLabel.className = "modalFormLabel";
        this.imageLabel.className = "modalFormLabel";
        this.nameField.className = "modalFormTextField";
        this.flavorField.className = "modalFormTextField";
        this.slotsField.className = "modalFormNumberField";
        this.imageField.className = "modalFormImageField";
        this.customImageField.className = "modalFormImageField";
        this.submitButton.className = "modalFormSubmitButton";
    }
    
    #assignFormElementIds(){
        this.formElement.id = "wandAddForm";
    }
    
    #relateFormElements(){
        this.formElement.appendChild(this.titleElement);
        this.formElement.appendChild(this.fieldContainerElement);
        this.fieldContainerElement.appendChild(this.nameLabel);
        this.fieldContainerElement.appendChild(this.nameField);
        this.fieldContainerElement.appendChild(this.flavorLabel);
        this.fieldContainerElement.appendChild(this.flavorField);
        this.fieldContainerElement.appendChild(this.slotsLabel);
        this.fieldContainerElement.appendChild(this.slotsField);
        this.fieldContainerElement.appendChild(this.imageLabel);
        this.fieldContainerElement.appendChild(this.imageField);
        this.fieldContainerElement.appendChild(this.customImageField);
        this.fieldContainerElement.appendChild(this.submitButton);
    }
    
    #fillFormInnerHTML(){
        this.titleElement.innerHTML = "Create New Wand";
        this.nameLabel.innerHTML = "Name";
        this.flavorLabel.innerHTML = "Subtitle";
        this.slotsLabel.innerHTML = "Number of Slots";
        this.imageLabel.innerHTML = "Image (or custom)";
    }

    drawElement(parentElement){
        parentElement.appendChild(this.formElement);
        this.#addEventListeners();
    }

    #addEventListeners(){
        logText("Someday this will do something.");
    }
}

