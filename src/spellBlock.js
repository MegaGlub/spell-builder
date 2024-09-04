import { logText } from "./logging.js";
import { clearChildren } from "./elementHelpers.js";

export class spellBlock {
    constructor(spellsByComponent, positionInWand, descriptionElement) {
        this.spells = spellsByComponent;
        this.positionInWand = positionInWand;
        this.errorBox = "";
        this.descriptionElement = descriptionElement;

        this.textBox = this.descriptionElement.children[0];
        this.statBox = this.descriptionElement.children[1];
        this.errorBox = this.descriptionElement.children[2];

        this.voidComponent = this.#findComponentByType("Void");
        this.pathComponent = this.#findComponentByType("Path");
        this.enhancementComponents = this.#findAllComponentsByType("Enhancement");
        this.formComponent = this.#findComponentByType("Form");
        this.purposeComponents = this.#findAllComponentsByType("Purpose");
        this.triggerComponent = this.#findComponentByType("Trigger");

        this.#discoverBasicStats();
    }

    #discoverBasicStats(){ //more stats to be add: dmg, dice type, hit type, hit mod, etc.
        this.inverted = false;
        if (this.voidComponent) {
            this.inverted = true;
        }
        this.potency = 0;
        for (let component of this.spells) {
            this.potency += component.statBlock.potency;
        }
    }

    compileSpell(){
        if (this.#errorTest()) {
            this.#addDescriptionText("Spell has one or more fatal errors and cannot be compiled!");
        } else {
            this.#fillPathText();
            this.#fillFormText();
            this.#fillEnhancementText();
            this.#fillPurposeText();
            this.#fillTriggerText();
        }
    }

    #fillPathText(){
        this.#addDescriptionText(this.pathComponent.pathDescription, this.pathComponent.type);
    }

    #fillFormText(){
        this.#addDescriptionText(this.formComponent.formDescription, this.formComponent.type);
    }

    #fillEnhancementText(){
        if (this.enhancementComponents.length > 0) {
            for (let enhancement of this.enhancementComponents) {
                this.#addDescriptionText(enhancement.enhancementDescription, enhancement.type);
            }
        }
    }

    #fillPurposeText() {
        for (let i = 0; i < this.purposeComponents.length - 1; i++){
            this.#addPurposeToText(this.purposeComponents[i]);
            this.#addDescriptionText(" and ");
        }
        this.#addPurposeToText(this.purposeComponents[this.purposeComponents.length - 1]);
        this.#addDescriptionText(". ");
    }

    #fillTriggerText(){
        if (this.triggerComponent) {
            this.#addDescriptionText(this.triggerComponent.triggerDescription, this.triggerComponent.type);
        }
    }

    #addPurposeToText(purpose){
        if (purpose.invertible == "true" && this.inverted){ //purpose.invertible is being stored as a string
            if (this.potency <= -2){
                this.#addDescriptionText(purpose.purposeDescriptions["invHigh"], purpose.type, purpose.primaryType);
            } else if (this.potency <= 1){
                this.#addDescriptionText(purpose.purposeDescriptions["invMid"], purpose.type, purpose.primaryType);
            } else{
                this.#addDescriptionText(purpose.purposeDescriptions["invLow"], purpose.type, purpose.primaryType);
            }
        } else{
            if (this.potency >= 2){
                this.#addDescriptionText(purpose.purposeDescriptions["high"], purpose.type, purpose.primaryType);
            } else if (this.potency >= -1){
                this.#addDescriptionText(purpose.purposeDescriptions["mid"], purpose.type, purpose.primaryType);
            } else{
                this.#addDescriptionText(purpose.purposeDescriptions["low"], purpose.type, purpose.primaryType);
            }
        }
    }
    
    #addDescriptionText(text, componentType, specifier){ //specifier is optional controlling the underlines, -1 when not in use
        const textElement = document.createElement("span");
        if (componentType){
            textElement.style.color = this.#getDescriptionColor(componentType);
        }
        if (specifier){
            const underlineColor = this.#getDescriptionUnderlineColor(specifier);
            textElement.style.textDecoration = "underline " + underlineColor;
        }
        textElement.innerHTML = text;
        //textElement.className = "";

        this.textBox.appendChild(textElement);
    }

    #getDescriptionColor(type){
        switch(type){
            case "Void":
                return "#8A2BE2";
            case "Form":
                return "#3CB371";
            case "Path":
                return "#DAA520";
            case "Purpose":
                return "#A0AECD";
            case "Enhancement":
                return "#6495ED";
            case "Refund":
                return "#BC8F8F";
            case "Trigger":
                return "#FA8072";
            default:
                return "#000000";
        }
    }

    #getDescriptionUnderlineColor(vis){
        switch(vis){
            case "Design":
                return "#DBA463";
            case "Nature":
                return "#3CB371";
            case "Eath":
                return "#5A4E44";
            case "Flesh":
                return "#E86A73";
            case "Heat":
                return "#B4202A";
            case "Flow":
                return "#588DBE";
            default:
                logText("Underline color for wand description failed, defaulting to black.");
                return "#000000";
        }
    }

    #errorTest() {
        this.#clearErrors();
        let fatalErrors = false;

        if (!this.pathComponent){
            this.#addError(true, "A spell block requires a Path component!");
            fatalErrors = true;
        }
        if (!this.formComponent){
            this.#addError(true, "A spell block requires a Form component!");
            fatalErrors = true;
        }
        if (this.purposeComponents.length == 0){
            this.#addError(true, "A spell block requires at least one Purpose component!");
            fatalErrors = true;
        }
        if (!this.#areAllPurposesInvertible() && this.voidComponent && this.purposeComponents.length != 0){
            this.#addError(false, "A spell block includes a \"Nothing\", but one or more of its Purposes are not invertible and unaffected.");
        }
        if (this.spells.length > 7) {
            this.#addError(false, "One or more spell blocks are quite long. This may result in goofy displays or extremely high mana costs.");
        }
        if (this.#findAllComponentsByType("Trigger").length > 1){
            this.#addError(true, "A spell block may only contain up to one Trigger!");
            fatalErrors = true;
        }
        if (this.#findAllComponentsByType("Path").length > 1){
            this.#addError(true, "A spell block may only contain up to one Path!");
            fatalErrors = true;
        }
        if (this.#findAllComponentsByType("Form").length > 1){
            this.#addError(true, "A spell block may only contain up to one Form!");
            fatalErrors = true;
        }

        return fatalErrors;
    }

    #clearErrors(){
        clearChildren(this.errorBox);
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

    #findComponentByType(type) {
        for (let component of this.spells) {
            if (component.type == type) {
                return component;
            }
        }
    }

    #findAllComponentsByType(type) {
        const result = [];
        for (let component of this.spells) {
            if (component.type == type) {
                result.push(component);
            }
        }
        return result;
    }

    #areAllPurposesInvertible() {
        let result = true;
        for (let purpose of this.purposeComponents){
            if (purpose.invertible == "false"){ //typeless (but not *actually* typeless) my beloathed
                result = false;
            }
        }
        return result;
    }
}