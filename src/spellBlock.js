import { logText } from "./logging.js";
import { clearChildren, formatSize, getSign, timeFormat } from "./elementHelpers.js";
import { Dice } from "./dice.js";

export class spellBlock {
    constructor(spellsByComponent, positionInWand, descriptionElement) {
        this.spells = spellsByComponent;
        this.positionInWand = positionInWand;
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
    }

    compileSpell(){
        this.statBox.style.display = "none";
        if (this.#errorTest()) {
            this.#addDescriptionText("Spell has one or more fatal errors and cannot be compiled!");
        } else {
            this.#discoverBasicStats();

            this.#fillPathText();
            this.#fillEnhancementText();
            this.#fillFormText();
            this.#fillPurposeText();
            this.#fillTriggerText();

            this.#generateStatTable();
        }
    }

    #discoverBasicStats(){ 
        this.inverted = false;
        if (this.voidComponent) {
            this.inverted = true;
        }
        this.potency = 0;
        this.range = 0;
        this.size = 0;
        this.damageModifier = 0;
        this.hitModifier = 0;
        this.lifetime = 0;
        for (let component of this.spells) {
            this.potency += component.statBlock.potency;
            if (component.range){
                this.range += component.range;
            }
            if (component.size){
                this.size += component.size;
            }
            if (component.damageModifier){
                this.damageModifier += component.damageModifier;
            }
            if (component.hitModifier){
                this.hitModifier += component.hitModifier;
            }
            if (component.lifetime){
                this.lifetime += component.lifetime;
            }
        }
        this.hitSkill = this.pathComponent.hitSkill;
        this.#discoverDamage();
        this.effects = "None!"; //effects are discovered in this.addPurposeToText() for convenience, maybe redo later
    }

    #discoverDamage(){
        this.damageCount = 0;
        this.damageDice = Dice.D0;
        for (let component of this.spells){
            let newDmg = component.damageDice;
            if (newDmg){
                if (newDmg.sides > this.damageDice.sides){
                    this.damageDice = newDmg;
                }
            }
        }
        if (this.damageDice != Dice.D0){
            for (let component of this.spells){
                let newCnt = component.damageCount;
                if (newCnt){
                    this.damageCount += newCnt * (component.damageDice.sides / this.damageDice.sides);
                }
            }
        }
        this.damageCount = Math.floor(this.damageCount);
        //damage modifier is found in the normal stat blocks.
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
        if (purpose.statBlock.invertible == "true" && this.inverted){ //purpose.invertible is being stored as a string
            if (this.potency <= -2){
                this.#addDescriptionText(purpose.purposeDescriptions["invHigh"], purpose.type, purpose.costs["primaryType"]);
                this.#addNewEffect(purpose.statBlock.effects["invHigh"]);
            } else if (this.potency <= 1){
                this.#addDescriptionText(purpose.purposeDescriptions["invMid"], purpose.type, purpose.costs["primaryType"]);
                this.#addNewEffect(purpose.statBlock.effects["invMid"]);
            } else{
                this.#addDescriptionText(purpose.purposeDescriptions["invLow"], purpose.type, purpose.costs["primaryType"]);
                this.#addNewEffect(purpose.statBlock.effects["invLow"]);
            }
        } else{
            if (this.potency >= 2){
                this.#addDescriptionText(purpose.purposeDescriptions["high"], purpose.type, purpose.costs["primaryType"]);
                this.#addNewEffect(purpose.statBlock.effects["high"]);
            } else if (this.potency >= -1){
                this.#addDescriptionText(purpose.purposeDescriptions["mid"], purpose.type, purpose.costs["primaryType"]);
                this.#addNewEffect(purpose.statBlock.effects["mid"]);
            } else{
                this.#addDescriptionText(purpose.purposeDescriptions["low"], purpose.type, purpose.costs["primaryType"]);
                this.#addNewEffect(purpose.statBlock.effects["low"]);
            }
        }
    }
    
    #addDescriptionText(text, componentType, specifier){ //specifier is optional controlling the underlines, -1 when not in use
        const textElement = document.createElement("span");
        if (componentType){
            textElement.style.color = this.#getDescriptionColor(componentType);
        }
        console.log(text + " : " + componentType + " : " + specifier);
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

    #addNewEffect(effect){
        if (this.effects == "None!"){
            this.effects = effect;
        } else{
            this.effects += ", " + effect;
        }
    }

    #generateStatTable(){
        clearChildren(this.statBox);
        this.statBox.style.display = "inline";
        this.#createEmptyElements();
        this.#assignElementClasses();
        this.#assignElementIds();
        this.#relateElements();
        this.#fillInnerHTML();
    }

    #createEmptyElements(){
        this.statTableElement = document.createElement("div");
        this.damageCellElement = document.createElement("span");
        this.hitCellElement = document.createElement("span");
        this.effectsRowElement = document.createElement("span");
        this.rangeCellElement = document.createElement("span");
        this.sizeCellElement = document.createElement("span");
        this.lifetimeCellElement = document.createElement("span");
    }

    #assignElementClasses(){
        this.statTableElement.className = "componentStatTable";
        this.damageCellElement.className = "componentStatCell";
        this.hitCellElement.className = "componentStatCell";
        this.effectsRowElement.className = "componentStatRow";
        this.rangeCellElement.className = "componentStatCell";
        this.sizeCellElement.className = "componentStatCell";
        this.lifetimeCellElement.className = "componentStatCell";
    }

    #assignElementIds(){
        //Nope!
    }

    #relateElements(){
        this.statBox.appendChild(this.statTableElement);
        this.statTableElement.appendChild(this.damageCellElement);
        this.statTableElement.appendChild(this.hitCellElement);
        this.statTableElement.appendChild(this.effectsRowElement);
        this.statTableElement.appendChild(this.rangeCellElement);
        this.statTableElement.appendChild(this.sizeCellElement);
        this.statTableElement.appendChild(this.lifetimeCellElement);
    }

    #fillInnerHTML(){
        this.damageCellElement.innerHTML = "Damage: " + this.#formatDamage(); //ex: 2d6 + 2
        this.hitCellElement.innerHTML = "To-Hit: " + this.hitSkill + " " + getSign(this.hitModifier);
        this.effectsRowElement.innerHTML = "Effects: " + this.effects;
        this.rangeCellElement.innerHTML = "Range: ~" + formatSize(this.range);
        this.sizeCellElement.innerHTML = "Size: " + formatSize(this.size);
        this.lifetimeCellElement.innerHTML = "Lifetime: " + timeFormat(this.lifetime);  
    }

    #formatDamage (){
        if (this.damageDice.val == 0){
            return "0";
        }

        let result = "";
        result += this.damageCount;
        result += this.damageDice.val;
        if (this.damageModifier != 0){
            result += " ";
            result += getSign(this.damageModifier);
        }
        return result;
    }

    #errorTest() {
        this.#clearErrors();
        let fatalErrors = false;

        if (this.spells.length < 3){
            this.#addError(true, "A spell block has less than 3 slots!")
            fatalErrors = true;
            return fatalErrors;
        }
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
            this.#addError(false, "A spell block is quite long. This may result in goofy displays or extremely high mana costs.");
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
        if (this.#areThereDuplicatesInList(this.purposeComponents)){
            this.#addError(true, "A spell block may not contain two of the same Purpose!");
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
        errorMsg.innerHTML +=  "(Block position: " + this.positionInWand + "-" + (this.positionInWand + this.spells.length - 1) + ")"
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
            if (purpose.statBlock.invertible == "false"){ //typeless (but not *actually* typeless) my beloathed
                result = false;
            }
        }
        return result;
    }

    #areThereDuplicatesInList(list) {
        let result = false;
        for (let i = 0; i < list.length; i++){
            for (let j = i + 1; j < list.length; j++){
                if (list[i].name == list[j].name){
                    return true;
                }
            }
        }
    }
}