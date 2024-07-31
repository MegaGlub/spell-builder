const modalContent = document.getElementById("modalContent");
const modalBackground = document.getElementById("modalBackground");

export function createWandAddButton() {
    const wandAddButton = document.getElementById("wandAddButton");
    wandAddButton.src = "images/ui/add.png";
    assignClickableButtonByID("wandAddButton", handleOpenAddPress);
    createWandForm();
}

function handleOpenAddPress(){
    logText("Preparing to add new wand.");
    modalBackground.style.display = "block";
    modalContent.innerHTML = "wand form here (eventually)";
}

function createWandForm(){
    
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
        this.formElement = document.createElement("form");
        this.titleElement = document.createElement("div");
        this.fieldContainerElement = document.createElement("div"); //flexbox?
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
    }
    
    #assignFormElementIds(){
        
    }
    
    #relateFormElements(){
    
    }
    
    #fillFormInnerHTML(){
    
    }

    drawElement(parentElement){

    }
}

