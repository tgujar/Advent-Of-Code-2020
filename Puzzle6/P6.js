// Puzzle available at https://adventofcode.com/2020/day/6

const fs = require('fs');
let allAns;

try {
    const data = fs.readFileSync('input.txt', 'utf8');
    allAns = data.toString().split("\n\n");
} catch (e) {
    console.log('Error:', e.stack);
}

const union = (setA, setB) => {
    let _union = new Set(setA);
    for (let elem of setB) {
        _union.add(elem);
    }
    return _union;
}

const intersection = (setA, setB) => {
    let _intersection = new Set();
    for (let elem of setA) {
        if (setB.has(elem)) _intersection.add(elem);
    }
    return _intersection;
}

function indiviualAnsSets(groupAns) {
    return groupAns.split("\n").map(individualAns => {
        return new Set(individualAns.split(""));
    })
}

function getAnsSet(groupAns, setCombiner) {
    return indiviualAnsSets(groupAns)
            .reduce((acc, indAns) => {
                return setCombiner(acc, indAns);
            });
}


console.log(allAns.reduce((acc, groupAns) => {
        return acc + getAnsSet(groupAns, union).size
    }, 0)) //part 1

console.log(allAns.reduce((acc, groupAns) => {
        return acc + getAnsSet(groupAns, intersection).size
    }, 0)) // part 2