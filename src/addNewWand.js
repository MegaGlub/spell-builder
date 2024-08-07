var fs = module.require('fs');
import { assignClickableButtonByElement, assignClickableButtonByID, hideModal } from "./buttons.js";
import { logText } from "./logging.js";
import { wandList } from "../main.js";
import { wand } from "./wand.js";
import { readImageDirectory } from "./fileMods.js";

const modalContent = document.getElementById("modalContent");
const modalBackground = document.getElementById("modalBackground");
let wandFormHelper;

export function createWandAddButton() {
    const wandAddButton = document.getElementById("wandAddButton");
    wandAddButton.src = "images/ui/add.png";
    assignClickableButtonByID("wandAddButton", handleOpenAddPress);
    wandFormHelper = new wandFormCreator();
}

function handleOpenAddPress() {
    logText("Preparing to add new wand.");
    modalBackground.style.display = "block";
    while (modalContent.firstChild) {
        modalContent.removeChild(modalContent.firstChild);
    }
    wandFormHelper.drawElement(modalContent);
}

export function handleDeleteWandPress(wandName) {
    logText("Preparing to delete wand: " + wandName + "...");
    const wandDeleter = new wandDestroyer(wandName);
    modalBackground.style.display = "block";
    while (modalContent.firstChild) {
        modalContent.removeChild(modalContent.firstChild);
    }
    wandDeleter.drawElement(modalContent);
}

function deleteWand(name) {
    for (let i = 0; i < wandList.length; i++) {
        if (wandList[i].name == name) {
            for (let j = i; j < wandList.length - 1; j++) {
                wandList[j] = wandList[j + 1];
            }
            const wandSelector = document.getElementById("wandSelector");
            const removedWand = document.getElementById("wand" + name);
            wandSelector.removeChild(removedWand);
            const wandWorkbench = document.getElementById("wandWorkbench");
            while (wandWorkbench.firstChild){
                wandWorkbench.removeChild(wandWorkbench.firstChild);
            }
            return true;
        }
    }
    return false;
}

class wandFormCreator {
    constructor() {
        this.availableImages = readImageDirectory("images/wands");
        console.log(this.availableImages);
        this.acceptedMinorErrors = false;

        this.#createEmptyFormElements();
        this.#assignFormElementClasses();
        this.#assignFormElementIds();
        this.#assignInputTypes();
        this.#fillDefaultValues();
        this.#relateFormElements();
        this.#fillFormInnerHTML();
    }

    #createEmptyFormElements() {
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
        this.imageField = document.createElement("input");
        this.imageSelectionField = document.createElement("form");
        this.#createImageOptions();
        this.customImageField = document.createElement("input");
        this.customImageDisplay = document.createElement("img");
        this.submitRow = document.createElement("span");
        this.submitButton = document.createElement("div");
        this.errorBox = document.createElement("div");
    }

    #createImageOptions() {
        // let index = 0;
        for (let image of this.availableImages) {
            this.#addImageOption(image);
        }
    }

    #addImageOption(image) {
        const optionContainer = document.createElement("label");
        const clickableBits = document.createElement("input");
        const imageElement = document.createElement("img");
        optionContainer.className = "wandImageSelectionContainer";
        clickableBits.className = "wandImageSelectionInput";
        imageElement.className = "wandIcon";
        clickableBits.type = "radio";
        clickableBits.name = "line-style";
        // clickableBits.value = index;
        clickableBits.value = image;
        imageElement.src = image;
        this.imageSelectionField.appendChild(optionContainer);
        optionContainer.appendChild(clickableBits);
        optionContainer.appendChild(imageElement);
        // index++;
        assignClickableButtonByElement(clickableBits, this.#handleImageOptionPress.bind(this));
    }

    #handleImageOptionPress(event) {
        const pressedImage = event.srcElement;
        this.imageField.value = pressedImage.value;
    }

    #assignFormElementClasses() {
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
        this.imageCell.className = "modalFormRow";
        this.imageLabel.className = "modalFormLabel";
        this.imageField.className = "modalFormTextField";
        this.imageSelectionField.className = "modalFormImageField";
        this.customImageField.className = "modalFormCustomImageField";
        this.customImageDisplay.className = "modalFormCustomImageDisplay";
        this.submitRow.className = "modalFormRow";
        this.submitButton.className = "modalFormSubmitButton";
        this.errorBox.className = "modalFormErrorBox";
    }

    #assignFormElementIds() {
        this.formContainerElement.id = "wandAddForm";
        this.imageField.id = "wandAddFormImageField";
    }

    #assignInputTypes() {
        this.nameField.type = "text";
        this.flavorField.type = "text";
        this.slotsField.type = "number";
        this.imageField.type = "text";
        this.imageField.style.display = "none";
        this.imageSelectionField.type = "radio";
        this.customImageField.type = "file";
    }

    #fillDefaultValues() {
        this.nameField.value = "New Wand";
        this.flavorField.value = "What does it do?";
        this.slotsField.value = 3;
        const imageOptions = this.imageSelectionField.querySelectorAll(".wandImageSelectionInput");
        imageOptions[0].checked = "true";
        this.imageField.value = this.availableImages[0];
    }

    #relateFormElements() {
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
        this.imageCell.appendChild(this.imageSelectionField);
        this.imageCell.appendChild(this.customImageField);
        this.imageCell.appendChild(this.customImageDisplay);
        this.formElement.appendChild(this.submitRow);
        this.submitRow.appendChild(this.submitButton);
        this.formContainerElement.appendChild(this.errorBox);
    }

    #fillFormInnerHTML() {
        this.titleElement.innerHTML = "Create New Wand";
        this.nameLabel.innerHTML = "Name";
        this.flavorLabel.innerHTML = "Subtitle";
        this.slotsLabel.innerHTML = "Slots";
        this.imageLabel.innerHTML = "Icon";
        this.customImageField.innerHTML = "Custom (128x64)";
        this.submitButton.innerHTML = "Create Wand";
    }

    drawElement(parentElement) {
        parentElement.appendChild(this.formContainerElement);
        this.#addEventListeners();
    }

    #addEventListeners() {
        this.#addCustomImage();
        assignClickableButtonByElement(this.submitButton, this.#handleSubmission.bind(this));
    }

    #addCustomImage() {
        this.customImageField.accept = "image/*";
        this.customImageField.addEventListener('change', (event) => {
            const file = event.target.files[0];
            console.log(event.target.files);
            const path = file.path;
            this.imageField.value = path;
            this.#addImageOption(path);
            const imageOptions = this.imageSelectionField.querySelectorAll(".wandImageSelectionInput");
            imageOptions[imageOptions.length - 1].checked = "true";
        });
    }

    #isWandNameUnique(){
        for (let wand of wandList){
            if (wand.name == this.nameField.value){
                return false;
            }
        }
        return true;
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

    #clearErrors(){
        while (this.errorBox.firstChild) {
            this.errorBox.removeChild(this.errorBox.firstChild);
        }
    }

    #handleSubmission() {
        this.#clearErrors();
        let fatalErrors = false;
        let minorErrors = false;
        if (!this.nameField.value){
            fatalErrors = true;
            this.#addError(true, "You must have a wand name!");
        }
        if (!this.#isWandNameUnique()){
            fatalErrors = true;
            this.#addError(true, "Wand name must be unique!");
        }
        if (!this.flavorField.value){
            minorErrors = true;
            this.#addError(false, "Wand does not have flavor text, which may cause it to display strangely. Click again to create anyways.");
        }
        if (this.slotsField.value > 15){
            minorErrors = true;
            this.#addError(false, "Wand has too many slots and may not display properly. Click again to create anyways.");
        }
        if (this.slotsField.value < 3){
            fatalErrors = true;
            this.#addError(true, "You do not have enough available slots to even build a spell (minimum 3)!")
        }
        if (!this.imageField.value){
            fatalErrors = true;
            this.#addError(true, "You must select an icon for the wand!");
        }
        if (!fatalErrors && ((!minorErrors) || (minorErrors && this.acceptedMinorErrors))){
            this.#actuallySubmitTheDamnThing();
        } else if (minorErrors){
            this.acceptedMinorErrors = true;
        }
    }
    #actuallySubmitTheDamnThing() {
        const slots = [];
        for (let i = 0; i < this.slotsField.value; i++) {
            slots.push("Nothing");
        }
        wandList.push(new wand(
            this.nameField.value,
            this.flavorField.value,
            this.imageField.value,
            slots
        ));
        wandList[wandList.length - 1].drawElement(document.getElementById("wandSelector"));
        this.#clearErrors();
        hideModal();
    }
}

class wandDestroyer {
    constructor(wandName) {
        this.wandName = wandName;

        this.container = document.createElement("span");
        this.warningText = document.createElement("div");
        this.deleteButton = document.createElement("div");

        this.container.className = "modalFormContainer";
        this.deleteButton.className = "modalFormSubmitButton";

        this.warningText.innerHTML = "Are you sure you want to delete " + wandName + "? This cannot be undone!";
        this.deleteButton.innerHTML = "Delete Wand";

        this.container.appendChild(this.warningText);
        this.container.appendChild(this.deleteButton);
    }

    drawElement(parentElement){
        parentElement.appendChild(this.container);
        this.#addEventListeners();
    }

    #addEventListeners(){
        assignClickableButtonByElement(this.deleteButton, () => {
            deleteWand(this.wandName);
            logText("Deleting wand" + this.wandName);
            hideModal();
        });
    }
}

