import { logText } from "./logging.js";

export function quickSort(componentList){
    quickSortRecursive(componentList, 0, componentList.length - 1);
}

function quickSortRecursive(list, low, high) {
    if (low < high) {
        let pIndex = partition(list, low, high);
  
        quickSortRecursive(list, low, pIndex - 1);
        quickSortRecursive(list, pIndex + 1, high);
    }
}

function partition(list, low, high){
    let pivot = list[high];
    // logText("Pivot: " + pivot.name);
    let i = low - 1;

    for (let j = low; j <= high - 1; j++){
        if (list[j].compareTo(pivot) < 0){
            i++;
            [list[i], list[j]] = [list[j], list[i]];
        }
    }

    [list[i + 1], list[high]] = [list[high], list[i + 1]];
    return i + 1;
}