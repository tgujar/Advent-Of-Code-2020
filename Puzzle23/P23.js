// Puzzle available at https://adventofcode.com/2020/day/23

let cups = "368195742".split("").map(e => Number(e));

function createCLL(cups) { // uses Maps to create a circular linked list
    let cll = new Map()
    const len = cups.length;
    const [min, max] = cups.reduce(([min, max], elem) => {
        if (elem < min) return [elem, max];
        else if (elem > max) return [min, elem];
        return [min, max];
    }, [cups[0], cups[0]]);
    
    for (let i = 0; i < len - 1; i++) {
        cll.set(cups[i], cups[i+1])
    }
    cll.set(cups[len - 1], cups[0]);
    cll.set("min", min)
    cll.set("max", max);
    cll.set("len", len);
    return cll;
}

function move(cll, start, pick, min, max) {
    let cllPart = [];
    let next = start;
    let dest = start - 1;
    for(let i = 0; i < pick; i++) {
        const value = cll.get(next);
        cllPart.push(value);
        next = value;
    }
    cll.set(start, cll.get(next));

    let lowest = min; let highest = max;
    for (let i of cllPart) {
        if(lowest == i) lowest +=1;
        else if(highest == i) highest -=1;
    }

    if (dest < lowest) dest = highest;
    while (cllPart.includes(dest)) {
        dest = dest - 1; 
    }

    const destNext = cll.get(dest);
    cll.set(dest, cllPart[0]);
    for(let i = 0; i < pick - 1; i++) {
        cll.set(cllPart[i], cllPart[i+1]);
    }
    cll.set(cllPart[pick - 1], destNext);
}

function doMoves(num, start, cll, pick) {
    const min = cll.get("min");
    const max = cll.get("max");
    for (let i = 0; i < num - 1; i++) {
        move(cll, start, pick, min, max);
        start = cll.get(start);
    }
    move(cll, start, pick, min, max);
    return start;
}

function findPattern(cll, num, pick) {
    let ans = [];
    next = cll.get(num);

    for(let i = 0; i < pick && next !== num; i++) {
        ans.push(next);
        next = cll.get(next);
    }
    return ans;
}

let cll1 = createCLL(cups);
let cll2 = createCLL(cups.concat(new Array(1000000 - cups.length).fill(null).map((_, idx) => idx + 10)));

doMoves(100, cups[0], cll1, 3);
console.log(findPattern(cll1, 1, cll1.get("len")).join("")); // part 1
doMoves(10000000, cups[0], cll2, 3);
console.log(findPattern(cll2, 1, 2).reduce((prod, elem) => prod * elem, 1)); // part 2



