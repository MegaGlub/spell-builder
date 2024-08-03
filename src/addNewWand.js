var fs = module.require('fs');
import { assignClickableButtonByElement, assignClickableButtonByID, hideModal } from "./buttons.js";
import { logText } from "./logging.js";
import { wandList } from "../main.js";
import { wand } from "./wand.js";

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

class wandFormCreator {
    constructor() {
        this.availableImages = ["images/wands/wood-orbit.png", "images/wands/wood-blood.png", "images/wands/wood-orbit.png", "images/wands/wood-blood.png"]; //make a method for this later

        this.#createEmptyFormElements();
        this.#assignFormElementClasses();
        this.#assignFormElementIds();
        this.#assignInputTypes();
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
    }

    #fillFormInnerHTML() {
        this.titleElement.innerHTML = "Create New Wand";
        this.nameLabel.innerHTML = "Name";
        this.flavorLabel.innerHTML = "Subtitle";
        this.slotsLabel.innerHTML = "Slots";
        this.imageLabel.innerHTML = "Image";
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

    #handleSubmission() {
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
        hideModal();
    }
}

