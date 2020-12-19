const fs = require('fs');
let rules, msgs;
try {
    // let data = fs.readFileSync('input1.txt', 'utf8'); // part 1
    let data = fs.readFileSync('input2.txt', 'utf8'); // part 2
    [rules, msgs] = data.toString().split("\n\n").map(e => e.split("\n"));
} catch (e) {
    console.log('Error:', e.stack);
}

const ruleMap = new Map();
rules.forEach(row => {
    const [ruleNum, rules] = row.split(":");
    ruleMap.set(ruleNum, rules.split("|").map(rule => {
        return rule.trim().replace(/"/g, "").split(" ");
    }));
})
 
function reduceRule(ruleNum) {
    const rules = ruleMap.get(ruleNum);
    const r = rules
        .map(rule => {
            return rule.reduce((subStr, char) => {
                if (/[a-zA-Z]/.test(char)) return subStr + char;
                return subStr + reduceRule(char);
            }, "");
        });
    return "(" + r.join("|") + ")";
}

function part2(str) {
    let a = reduceRule("42");
    let b = reduceRule("31");
    let aCount = 0;
    let aReg = new RegExp(a, "g");
    while(aReg.exec(str)) aCount++;

    for (let i = 1; i < aCount; i++) {
        if(new RegExp(`^${a}{${i+1},}${b}{${i}}$`).test(str)) return true;
    }
    return false;
}

// const regex = new RegExp("^"+reduceRule("0")+"$"); // part 1
// console.log(msgs.reduce((matches, msg) => regex.test(msg) ? matches + 1 : matches, 0)); // part 1
console.log(msgs.reduce((matches, msg) => part2(msg) ? matches + 1 : matches, 0)); // part 2

