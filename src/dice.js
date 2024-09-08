import { logText } from "./logging.js";

export const Dice = Object.freeze({
    D2: { val: "d2", sides: 2, avg: 1.5 },
    D3: { val: "d3", sides: 3, avg: 2 },
    D4: { val: "d4", sides: 4, avg: 2.5 },
    D6: { val: "d6", sides: 6, avg: 3.5 },
    D8: { val: "d8", sides: 8, avg: 4.5 },
    D12: { val: "d12", sides: 12, avg: 6.5 },
    D20: { val: "d20", sides: 20, avg: 10.5 },
    D30: { val: "d30", sides: 30, avg: 15.5 },
    D50: { val: "d50", sides: 50, avg: 25.5 },
    D100 : { val: "d100", sides: 100, avg: 50.5 }
});

export function findDiceByString(str){
    switch(str){
        case("d2"):
            return Dice.D2;
        case("d3"):
            return Dice.D3;
        case("d4"):
            return Dice.D4;
        case("d6"):
            return Dice.D6;
        case("d8"):
            return Dice.D8;
        case("d12"):
            return Dice.D12;
        case("d20"):
            return Dice.D20;
        case("d30"):
            return Dice.D30;
        case("d50"):
            return Dice.D50;
        case("d100"):
            return Dice.D100;
        default:
            return undefined;
    }
}