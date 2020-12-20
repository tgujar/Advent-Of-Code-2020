const fs = require('fs');
let rules, msgs;
try {
    //let data = fs.readFileSync('input1.txt', 'utf8'); // part 1
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

function recurMatch(str, ...rules) {
    let chars;
    if (rules.length === 0) {
        return str ? false : true;
    }
    if (chars = rules[0].match(/[a-z]*/)[0]) {
        return str.startsWith(chars[0]) ?
        recurMatch(str.slice(chars.length), ...rules.slice(1))
        : false;
    } 
    const rule = ruleMap.get(rules[0]);
    return rule.some(r => {
        return recurMatch(str, ...r.concat(rules.slice(1)));
    }); 
}

console.log(msgs.reduce((count, msg) => recurMatch(msg, "0") ? count + 1 : count, 0));
