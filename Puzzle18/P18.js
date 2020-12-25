// Puzzle available at https://adventofcode.com/2020/day/18
const fs = require('fs');
let exps;
try {
    let data = fs.readFileSync('input.txt', 'utf8');
    exps = data.toString().split("\n");
} catch (e) {
    console.log('Error:', e.stack);
}

function evaluate(exp) {
    exp = exp.replace(/\s/g, "");
    while (exp.includes("(")) {
        exp = exp.replace(/\(([\d+*]*)\)/, (_, arg) => evaluate(arg))
    }
    while(isNaN(Number(exp))) {
        exp = exp.replace(/\d+[+*]\d+/, eval);
    }
    return Number(exp);
}

function evaluate2(exp) {
    while (exp.includes("(")) {
        exp = exp.replace(/\(([\d+*\s]*)\)/, (_, arg) => evaluate2(arg))
    }
    return Number(exp
        .replace(/\s/g, "")
        .replace(/\d[\d+]*\d/g, eval)
        .replace(/\d[\d*]*\d/g, eval));
}

console.log(exps.reduce((acc, exp) => evaluate(exp) + acc, 0)); // part 1
console.log(exps.reduce((acc, exp) => evaluate2(exp) + acc, 0)); // part 2