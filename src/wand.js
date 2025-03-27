import { logText } from "./logging.js";
import { assignToolTip } from "./toolTips.js";
import { assignClickableButtonByID, assignClickableButtonByElement, assignDroppableAreaByElement, assignEditableTextByElement } from "./buttons.js";
import { findComponentByName, componentList, setSelectedWand, projectPath } from "../main.js";
import { handleDeleteWandPress } from "./addNewWand.js";
import { clearChildren, filterStringForJSON } from "./elementHelpers.js";
import { formatFileName, saveJSONFile } from "./json.js";
import { spellBlock } from "./spellBlock.js";
import { deleteWandCookie } from "./cookies.js";

export class wand {
    constructor(name, flavor, image, slotsByName, statBlock, lockedSlots) {
        this.name = name;
        this.flavor = flavor;
        this.image = image;
        this.slotsByName = slotsByName;
        this.lockedSlots = lockedSlots;
        this.spellBlockCount = 0;

        this.slotsByObject = [];

        this.#discoverStats(statBlock);
        this.buildWandVisuals();
        logText("\tWand built: " + this.name + ".");
    }

    #discoverStats(statBlock) {
        if (statBlock[Symbol.toStringTag] == "Map") {
            this.statBlock = statBlock;
        } else {
            this.statBlock = new Map(Object.entries(statBlock));
        }
    }

    buildWandVisuals() {
        this.#createEmptyElements();
        this.#assignElementClasses();
        this.#assignElementIds();
        this.#assignImage();
        this.#relateElements();
        this.#fillInnerHTML();
        this.updateComponentDisplay();
    }

    #createEmptyElements() {
        this.wandElement = document.createElement("span");
        this.descriptionElement = document.createElement("span");
        this.spellTitleElement = document.createElement("div");
        this.spellTypeElement = document.createElement("div");
        this.spellFlavorElement = document.createElement("div");
        this.imageElement = document.createElement("img");
        this.componentDisplayElement = document.createElement("div");
        this.deleteButtonElement = document.createElement("img");
        this.spellDescriptionElement = document.createElement("div");
        this.errorBoxDescriptionElement = document.createElement("div");
    }

    #assignElementClasses() {
        this.wandElement.className = "wandIcon";
        this.descriptionElement.className = "wandDescription";
        this.spellTitleElement.className = "spellTitle";
        this.spellFlavorElement.className = "spellFlavor";
        this.componentDisplayElement.className = "wandComponentDisplay";
        this.deleteButtonElement.className = "wandDeleteButton";
        this.spellDescriptionElement.className = "wandSpellDescription";
        this.errorBoxDescriptionElement.className = "wandSpellDescriptionErrors";
    }

    #assignElementIds() {
        this.wandElement.id = "wand" + this.name;
        this.descriptionElement.id = "wandDescription" + this.name;
        this.spellDescriptionElement.id = "wandSpellDescription";
    }

    #assignImage() {
        this.imageElement.src = this.image;
        this.deleteButtonElement.src = "images/ui/trash.png";
    }

    #relateElements() {
        this.wandElement.appendChild(this.imageElement);
        this.descriptionElement.appendChild(this.spellTitleElement);
        this.descriptionElement.appendChild(this.spellFlavorElement);
        this.descriptionElement.appendChild(this.componentDisplayElement);
        this.spellDescriptionElement.appendChild(this.errorBoxDescriptionElement);
    }

    #fillInnerHTML() {
        this.spellTitleElement.innerHTML = this.name;
        this.spellFlavorElement.innerHTML = this.flavor;
    }

    drawElement(parentElement) {
        parentElement.appendChild(this.wandElement);
        this.addEventListeners();
    }

    addEventListeners() {
        assignToolTip(this.wandElement, this.descriptionElement);
        assignClickableButtonByID("wand" + this.name, this.selectWand.bind(this)); //the bind is stupid ahhh hell, but it keeps "this" in the right scope
    }

    selectWand() {
        // logText("Selected wand " + this.name + ".");
        this.#addWandVFX();
        const descriptionClone = this.#duplicateSelectedDescription();
        this.#createDeleteButton(descriptionClone);
        this.#beautifySelectedTitle(descriptionClone);
        this.#replaceComponentsInClonedDescription(descriptionClone);
        this.#compileSpell();
        this.#createStatWidgets(descriptionClone);
        setSelectedWand(this);
    }

    #addWandVFX() {
        const previouslySelectedWands = document.querySelectorAll(".selectedWand");
        if (previouslySelectedWands.length != 0) { //thank you javascript, very cool.
            previouslySelectedWands[0].classList.remove("selectedWand");
        }
        this.wandElement.classList.add("selectedWand");
    }

    #duplicateSelectedDescription() {
        const descriptionBox = document.getElementById("wandWorkbench");
        while (descriptionBox.firstChild) {
            descriptionBox.removeChild(descriptionBox.firstChild);
        }
        const descriptionClone = this.descriptionElement.cloneNode(true);
        descriptionBox.appendChild(descriptionClone);
        descriptionClone.id = "descriptionBoxClone";
        return descriptionClone;
    }

    #createDeleteButton(descriptionClone) {
        descriptionClone.appendChild(this.deleteButtonElement);

        const deleteWandDescription = document.createElement("span");
        deleteWandDescription.innerHTML = "Delete wand";

        assignToolTip(this.deleteButtonElement, deleteWandDescription);
        assignClickableButtonByElement(this.deleteButtonElement, () => {
            handleDeleteWandPress(this.name)
        });
    }

    #createStatWidgets(descriptionClone) {
        const widgetBox = document.createElement("div");
        const widgetTitle = document.createElement("div");
        widgetBox.className = "wandWidgetBox";
        widgetTitle.className = "widgetTitle";
        widgetTitle.innerHTML = "Wand Stat Modifiers";
        descriptionClone.appendChild(widgetBox);
        widgetBox.appendChild(widgetTitle);

        this.#createEmpowermentSwitch(widgetBox);
        this.#createStatFields(widgetBox);
    }

    #createEmpowermentSwitch(widgetBox) {
        const powerSelectionSwitch = document.createElement("form");
        powerSelectionSwitch.className = "radioWidgetGroup";
        widgetBox.appendChild(powerSelectionSwitch);
        this.empowerment = 0;

        this.#createEmpowermentOption(powerSelectionSwitch, "images/ui/empowered.png", 5, false, "Empowered Token");
        this.#createEmpowermentOption(powerSelectionSwitch, "images/ui/no-buffs.png", 0, true, "No Tokens");
        this.#createEmpowermentOption(powerSelectionSwitch, "images/ui/weakened.png", -5, false, "Weakened Token");
    }

    #createEmpowermentOption(powerSelectionSwitch, image, value, defaultSelected, toolTipDescription) {
        const optionContainer = document.createElement("label");
        const clickableBits = document.createElement("input");
        const imageElement = document.createElement("img");
        const description = document.createElement("span");

        optionContainer.className = "radioWidget";
        clickableBits.className = "radioWidgetInput";
        imageElement.className = "widgetIcon";
        clickableBits.type = "radio";
        clickableBits.name = "empowermentOption";
        clickableBits.value = value;
        clickableBits.checked = defaultSelected;
        imageElement.src = image;
        description.innerHTML = toolTipDescription;

        powerSelectionSwitch.appendChild(optionContainer);
        optionContainer.appendChild(clickableBits);
        optionContainer.appendChild(imageElement);

        assignClickableButtonByElement(clickableBits, this.#handleEmpowermentOptionPress.bind(this));
        assignToolTip(optionContainer, description);
    }

    #handleEmpowermentOptionPress(event) {
        const pressedOption = event.srcElement;
        const val = parseInt(pressedOption.value);
        const truePotency = this.statBlock.get("potency") - this.empowerment;
        this.statBlock.set("potency", truePotency + val);
        this.empowerment = val;
        this.#compileSpell();
    }

    #createStatFields(widgetBox) {
        const statBlockElement = document.createElement("span");
        statBlockElement.className = "widgetStatBlock";
        widgetBox.appendChild(statBlockElement);

        const widgets = [
            { "label": "Primary Cost", "defaultVal": this.statBlock.get("primaryCost"), "statKey": "primaryCost" },
            { "label": "Secondary Cost", "defaultVal": this.statBlock.get("secondaryCost"), "statKey": "secondaryCost" },
            { "label": "Energy Cost", "defaultVal": this.statBlock.get("energyCost"), "statKey": "energyCost" },
            { "label": "Potency", "defaultVal": this.statBlock.get("potency") - this.empowerment, "statKey": "potency" },
            { "label": "Complexity", "defaultVal": this.statBlock.get("complexity"), "statKey": "complexity" },
            { "label": "To-Hit Mod", "defaultVal": this.statBlock.get("hitModifier"), "statKey": "hitModifier" },
            { "label": "Damage Mod", "defaultVal": this.statBlock.get("damageModifier"), "statKey": "damageModifier" },
            { "label": "Range (cm)", "defaultVal": this.statBlock.get("range"), "statKey": "range" },
            { "label": "Size (cm)", "defaultVal": this.statBlock.get("size"), "statKey": "size" },
            { "label": "Lifetime", "defaultVal": this.statBlock.get("lifetime"), "statKey": "lifetime" },
            { "label": "Projectiles\n(Note: unstable)", "defaultVal": this.statBlock.get("projectileCount"), "statKey": "projectileCount" }
        ]
        for (const widget of widgets) {
            this.#generateStatField(statBlockElement, widget["defaultVal"], widget["label"], widget["statKey"]);
        }
    }

    #generateStatField(statBlockElement, defaultVal, label, statKey) {
        const widgetCell = document.createElement("span");
        const widgetLabel = document.createElement("label");
        const widgetField = document.createElement("input");
        widgetCell.className = "widgetCell";
        widgetLabel.className = "widgetLabel";
        widgetField.className = "widgetNumberField";

        widgetField.type = "number";
        widgetField.value = parseInt(defaultVal);
        widgetField.setAttribute("statKey", statKey);
        widgetLabel.innerHTML = label;

        statBlockElement.appendChild(widgetCell);
        widgetCell.appendChild(widgetLabel);
        widgetCell.appendChild(widgetField);

        assignEditableTextByElement(widgetField, this.#handleWidgetEdit.bind(this));
        assignClickableButtonByElement(widgetField, this.#handleWidgetEdit.bind(this));
        this.statBlock.set(statKey, parseInt(defaultVal));
    }

    #handleWidgetEdit(event) {
        const statKey = event.srcElement.getAttribute("statKey");
        let val = parseInt(event.srcElement.value);
        if (!val) {
            val = 0;
        }
        if (statKey == "potency") {
            val -= this.empowerment;
        }
        this.statBlock.set(statKey, val);
        this.#compileSpell();
    }

    #beautifySelectedTitle(descriptionClone) {
        const activeTitle = descriptionClone.querySelector(".spellTitle");
        activeTitle.classList.replace("spellTitle", "wandActiveTitle");
        assignEditableTextByElement(activeTitle, this.handleNameEdit.bind(this));
        const activeFlavor = descriptionClone.querySelector(".spellFlavor");
        activeFlavor.classList.replace("spellFlavor", "wandActiveFlavor");
        assignEditableTextByElement(activeFlavor, this.handleFlavorEdit.bind(this));
    }

    #replaceComponentsInClonedDescription(descriptionClone) {
        this.componentDroppableControllers = new Array(this.slotsByName.length);
        this.clonedDescriptionComponents = [];
        const clonedComponentDisplayElement = descriptionClone.querySelector(".wandComponentDisplay");
        clonedComponentDisplayElement.classList.add("wandActiveComponentDisplay");
        clonedComponentDisplayElement.id = "wandActiveComponentDisplay";
        while (clonedComponentDisplayElement.firstChild) {
            clonedComponentDisplayElement.removeChild(clonedComponentDisplayElement.firstChild);
        } //reclone the components so that they get new toolTip listeners
        for (let componentIndex in this.slotsByObject) {
            const componentClone = this.slotsByObject[componentIndex].clone();
            componentClone.locked = this.lockedSlots[componentIndex];
            componentClone.componentElement.classList.add("wandActiveComponent");
            componentClone.drawElement(clonedComponentDisplayElement);
            if (!componentClone.locked){
                this.componentDroppableControllers[componentIndex] = assignDroppableAreaByElement(
                    componentClone.componentElement,
                    this.#handleComponentHold.bind(this),
                    this.#handleComponentDrop.bind(this)
                );
            }
            assignClickableButtonByElement(componentClone.componentElement, this.#handleComponentClick.bind(this));
            this.clonedDescriptionComponents.push(componentClone);
        }
        descriptionClone.appendChild(this.spellDescriptionElement);
    }

    updateComponentDisplay() { //remember to change the slotsByName first!
        while (this.componentDisplayElement.firstChild) { //clear old components
            this.componentDisplayElement.removeChild(this.componentDisplayElement.firstChild);
        }
        var i = 0;
        for (let componentName of this.slotsByName) {
            this.fetchComponentFromList(componentName, i);
            i++;
        }
    }

    fetchComponentFromList(componentName, index) {
        const indexOfComponent = findComponentByName(componentName);
        if (indexOfComponent < 0) {
            logText("Failed to fetch " + componentName + " for wand " + this.name + "!");
        }
        else {
            const componentClone = componentList[indexOfComponent].clone();
            this.slotsByObject[index] = componentClone;
            componentClone.locked = this.lockedSlots[index];
            componentClone.drawElement(this.componentDisplayElement);
        }
    }

    #handleComponentHold() {
        document.getElementById("wandActiveComponentDisplay").style.backgroundColor = "#B0C4DE";
    }

    #handleComponentDrop(event) {
        const droppedElementId = event.dataTransfer.getData("text/plain");
        const positionInWand = this.findPositionInWand(event.clientX, event.clientY);
        this.slotsByName[positionInWand] = droppedElementId.substr(14);
        this.updateComponentDisplay();
        this.selectWand();
        document.getElementById("wandActiveComponentDisplay").style.backgroundColor = "#333333";
    }

    #handleComponentClick(event) {
        const positionInWand = this.findPositionInWand(event.clientX, event.clientY);
        const component = this.slotsByObject[positionInWand];
        if (this.lockedSlots[positionInWand] == true){
            this.lockedSlots[positionInWand] = false;
            /* Remove icon -> remove css -> re-enable droppable area */
            component.hideLock();
            this.componentDroppableControllers[positionInWand] = assignDroppableAreaByElement(
                component.componentElement,
                this.#handleComponentHold.bind(this),
                this.#handleComponentDrop.bind(this)
            );
        } else{
            this.lockedSlots[positionInWand] = true;
            /* Add icon -> add css -> disable droppable area */
            component.showLock();
            this.componentDroppableControllers[positionInWand].abort();
            this.componentDroppableControllers[positionInWand] = undefined;
        }
        this.updateComponentDisplay();
        this.selectWand();
    }

    findPositionInWand(clientX, clientY) { //finds the element by looking at the x coordinate of the drop action
        const descriptionBox = document.getElementById("wandActiveComponentDisplay");
        const availableComponents = [...descriptionBox.querySelectorAll(".wandActiveComponent")]; //converts the array-like into an array after grabbing
        const nearestElement = availableComponents.reduce((nearest, child) => {
            const componentPosition = child.getBoundingClientRect();
            const offsetX = clientX - componentPosition.left - (componentPosition.width / 2);
            const offsetY = clientY - componentPosition.top - (componentPosition.height / 2);
            if (this.isWithinBounds(offsetX, componentPosition.width) && this.isWithinBounds(offsetY, componentPosition.height)) {
                return child;
            } else {
                return nearest;
            }
        }, { offset: Number.POSITIVE_INFINITY });
        for (let i = 0; i < availableComponents.length; i++) { //turns that element into an index in the list
            if (availableComponents[i] == nearestElement) {
                return i;
            }
        }
        return -1;
    }

    isWithinBounds(offset, elementSize) { //finds the element that is within 64 px of the drop position
        return (offset < elementSize / 2 && offset > -(elementSize / 2));
    }

    handleNameEdit() {
        const activeTitle = document.getElementsByClassName("wandActiveTitle")[0];
        const newText = filterStringForJSON(activeTitle.innerHTML);
        const oldText = this.name;
        this.name = newText;
        this.spellTitleElement.innerHTML = newText;
        this.wandElement.id = "wand" + newText;
        this.descriptionElement.id = "wandDescription" + newText;
        deleteWandCookie(oldText);
        this.saveToFile();
    }

    handleFlavorEdit() {
        const activeFlavor = document.getElementsByClassName("wandActiveFlavor")[0];
        const newText = filterStringForJSON(activeFlavor.innerHTML);
        this.flavor = newText;
        this.spellFlavorElement.innerHTML = newText;
        console.log(activeFlavor);
        this.saveToFile();
    }

    #compileSpell() {
        clearChildren(this.spellDescriptionElement);
        const nonCompiledSpellBlocks = this.#detectSpellBlocks();
        let positionInWand = 1;
        for (let spellCollection of nonCompiledSpellBlocks) {
            let blockBranch;
            if (this.spellBlockCount >= 1) {
                blockBranch = this.#generateDescriptionElement("wandSpellDescriptionBranch");
            }
            const blockDescription = this.#generateDescriptionElement("wandSpellDescriptionWords"); //just the container
            const blockStats = this.#generateDescriptionElement("componentStatTable"); //just generates the container, not the table itself
            blockStats.classList.add("wandSpellDescriptionStats");
            const block = new spellBlock(spellCollection, positionInWand, this.statBlock, blockBranch, blockDescription, blockStats, this.errorBoxDescriptionElement);
            positionInWand += spellCollection.length;
            block.compileSpell();
            this.spellBlockCount++;
        }
        this.spellDescriptionElement.appendChild(this.errorBoxDescriptionElement);
        this.spellBlockCount = 0;
        this.saveToFile();
    }

    #detectSpellBlocks() { //TODO separates the spell into multiple blocks, returns an array of arrays with the split component at the front. may require a new component
        const result = [];
        let tempArr = [];
        for (let i = 0; i < this.slotsByObject.length; i++) {
            if (this.slotsByObject[i].type == "Branch") {
                result.push(tempArr);
                tempArr = [];
            }
            tempArr.push(this.slotsByObject[i]);
        }
        result.push(tempArr);
        return result;
    }

    #generateDescriptionElement(cssClass) {
        const result = document.createElement("span");
        result.className = cssClass;
        this.spellDescriptionElement.appendChild(result);
        return result;
    }

    saveToFile() {
        let wandJSON = (
            "{\n\t\"type\": \"Wand\","
            + "\n\t\"name\": \"" + this.name + "\","
            + "\n\t\"flavor\": \"" + this.flavor + "\","
            + "\n\t\"image\": \"" + this.image + "\","
            + "\n\t\"slots\": " + this.#packageArrayForSave(this.slotsByName) + ","
            + "\n\t\"lockedSlots\": " + this.#packageArrayForSave(this.lockedSlots) + ","
            + "\n\t\"statBlock\": " + this.#packageStatBlockForSave()
            + "\n}"
        );

        const fileName = formatFileName(this.name);
        saveJSONFile(projectPath + "data/wands/" + fileName + ".json", wandJSON, () => { logText("\tWand " + fileName + " saved!") });
    }

    #packageArrayForSave(arr) {
        let result = "[";
        for (let i = 0; i < arr.length - 1; i++) {
            if (typeof arr[i] == "string"){
                result += "\n\t\t\"" + arr[i] + "\",";
            } else{
                result += "\n\t\t" + arr[i] + ",";
            }
        }
        if (typeof arr[arr.length - 1] == "string") {
            result += "\n\t\t\"" + arr[arr.length - 1] + "\"";
        } else{
            result += "\n\t\t" + arr[arr.length - 1] + "";
        }
        result += "\n\t]";
        return result;
    }

    #packageStatBlockForSave() {
        let result = "{";
        for (const statArr of this.statBlock) {
            result += "\n\t\t\"" + statArr[0] + "\": " + statArr[1] + ",";
        }
        result = result.substring(0, result.length - 1); //trim last comma
        result += "\n\t}";
        return result;
    }
}