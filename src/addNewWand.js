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
        this.availableImages = ["images/wands/wood-orbit.png", "images/wands/wood-blood.png"]; //make a method for this later

        this.#createEmptyFormElements();
        this.#assignFormElementClasses();
        this.#assignFormElementIds();
        this.#assignInputTypes();
        this.#addFileSelection();
        this.#relateFormElements();
        this.#fillFormInnerHTML();
    }

    #createEmptyFormElements(){
        this.formContainerElement = document.createElement("div");
        this.titleElement = document.createElement("div");
        this.formElement = document.createElement("form"); //flexbox?
        this.nameCell = document.createElement("span");
        this.nameLabel = document.createElement("label");
        this.nameField = document.createElement("input");
        this.flavorCell = document.createElement("span");
        this.flavorLabel = document.createElement("label");
        this.flavorField = document.createElement("input");
        this.slotsCell = document.createElement("span");
        this.slotsLabel = document.createElement("label");
        this.slotsField = document.createElement("input");
        this.imageCell = document.createElement("span");
        this.imageLabel = document.createElement("label");
        this.imageField = document.createElement("form");
        this.#createImageOptions();
        this.customImageField = document.createElement("input");
        this.submitRow = document.createElement("span");
        this.submitButton = document.createElement("input");
    }

    #createImageOptions(){
        let index = 0;
        for (let image in this.availableImages){
            optionContainer = document.createElement("label");
            clickableBits = document.createElement("input");
            imageElement = document.createElement("img");
            optionContainer.className = "wandImageSelectionContainer";
            clickableBits.className = "wandImageSelectionInput";
            imageElement.className = "wandIcon";
            clickableBits.type = "radio";
            clickableBits.name = "line-style";
            clickableBits.value = index;
            imageElement.src = image;
            this.imageField.appendChild(optionContainer);
            index++;
        }
    }
    
    #assignFormElementClasses(){
        this.formContainerElement.className = "modalFormContainer";
        this.titleElement.className = "modalFormTitle";
        this.formElement.className = "modalForm";
        this.nameCell.className = "modalFormCell";
        this.nameLabel.className = "modalFormLabel";
        this.nameField.className = "modalFormTextField";
        this.flavorCell.className = "modalFormCell";
        this.flavorLabel.className = "modalFormLabel";
        this.flavorField.className = "modalFormTextField";
        this.slotsCell.className = "modalFormCell";
        this.slotsLabel.className = "modalFormLabel";
        this.slotsField.className = "modalFormNumberField";
        this.imageCell.className = "modalFormCell";
        this.imageLabel.className = "modalFormLabel";
        this.imageField.className = "modalFormImageField";
        this.customImageField.className = "modalFormCustomImageField";
        this.submitRow.className = "modalFormRow";
        this.submitButton.className = "modalFormSubmitButton";
    }
    
    #assignFormElementIds(){
        this.formContainerElement.id = "wandAddForm";
    }

    #assignInputTypes(){
        this.nameField.type = "text";
        this.flavorField.type = "text";
        this.slotsField.type = "number";
        this.imageField.type = "radio"; //Figure out image inputting
        this.customImageField.type = "file";
        this.submitButton.type = "submit";
    }

    #addFileSelection() {
        this.customImageField.accept = "image/*";
        const reader = new FileReader();
        this.customImageField.addEventListener('change', (event) => {
            const file = event.target.files[0];
            reader.readAsDataURL(file);
        });
        reader.onload = (event) => {
            /* IMAGE PREVIEW HERE */ = event.target.result;
        }
    }
    
    #relateFormElements(){
        this.formContainerElement.appendChild(this.titleElement);
        this.formContainerElement.appendChild(this.formElement);
        this.formElement.appendChild(this.nameCell);
        this.nameCell.appendChild(this.nameLabel);
        this.nameCell.appendChild(this.nameField);
        this.formElement.appendChild(this.flavorCell);
        this.flavorCell.appendChild(this.flavorLabel);
        this.flavorCell.appendChild(this.flavorField);
        this.formElement.appendChild(this.slotsCell);
        this.slotsCell.appendChild(this.slotsLabel);
        this.slotsCell.appendChild(this.slotsField);
        this.formElement.appendChild(this.imageCell);
        this.imageCell.appendChild(this.imageLabel);
        this.imageCell.appendChild(this.imageField);
        this.imageCell.appendChild(this.customImageField);
        this.formElement.appendChild(this.submitRow);
        this.submitRow.appendChild(this.submitButton);
    }
    
    #fillFormInnerHTML(){
        this.titleElement.innerHTML = "Create New Wand";
        this.nameLabel.innerHTML = "Name";
        this.flavorLabel.innerHTML = "Subtitle";
        this.slotsLabel.innerHTML = "Number of Slots";
        this.imageLabel.innerHTML = "Image (or custom 128x64)";
    }

    drawElement(parentElement){
        parentElement.appendChild(this.formContainerElement);
        this.#addEventListeners();
    }

    #addEventListeners(){
        logText("Someday this will do something.");
    }
}

