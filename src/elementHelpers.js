export function clearChildren(parentElement){
    while (parentElement.firstChild){
        parentElement.removeChild(parentElement.firstChild);
    }
}