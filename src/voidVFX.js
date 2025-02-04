import { componentList, selectedWand } from "../main.js";

export function voidMouseOver(event) {
    for (let component of componentList) {
        if (component.statBlock.get("invertible")) {
            component.componentElement.classList.add("spellComponentVoidable");
        }
    }
    if (selectedWand) {
        for (let component of selectedWand.slotsByObject) {
            if (component.statBlock.get("invertible")) {
                console.log(component);
                component.componentElement.classList.add("spellComponentVoidable");
                console.log(component.componentElement.classList.contains("spellComponentVoidable"));
                console.log(component);
            }
        }
    }
}

export function voidMouseOut(event) {
    for (let component of componentList) {
        if (component.statBlock.get("invertible")) {
            component.componentElement.classList.remove("spellComponentVoidable");
        }
    }
    if (selectedWand) {
        for (let component of selectedWand.slotsByObject) {
            if (component.statBlock.get("invertible")) {
                component.componentElement.classList.remove("spellComponentVoidable");
            }
        }
    }
}