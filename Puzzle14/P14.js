const fs = require('fs');
let inst;
try {
    let data = fs.readFileSync('input.txt', 'utf8');
    inst = data.toString().split("\n");

} catch (e) {
    console.log('Error:', e.stack);
}

function applyMaskV2(mask, value) {
    value = parseInt(value).toString(2).padStart(mask.length, 0);
    let possibleVals = value
                    .split("")
                    .map((bit, idx) => mask[idx] === "X" ? "X" : Number(mask[idx]) || bit);
    return possibleVals.reduce((acc, bit, idx) => {
        if (bit === "X") {
            return acc.map(v => v + 2**(mask.length - idx - 1)).concat(acc);
        }
        return acc.map(v => v + Math.floor(2**(mask.length - idx - 1)*Number(bit)));
    }, [0]);
}

function applyMaskV1(mask, value) {
    value = parseInt(value).toString(2).padStart(mask.length, 0);
    return parseInt(value
        .split("")
        .map((bit, idx) => mask[idx] === "X" ? bit : mask[idx])
        .join(""), 2);
}

const getMask = inst => inst.split("=")[1].trim();
const getMemValue = inst => {
    inst = inst.split("=");
    const value = parseInt(inst[1].trim());
    const addr = parseInt(inst[0].replace(/[^0-9]/g, ""));
    return [addr, value];
}
const writerV1 = (mem, addr, value, mask) => mem.set(String(addr), applyMaskV1(mask, value));
const writerV2 = (mem, addr, value, mask) => {
    let addrs = applyMaskV2(mask, addr);
    addrs.forEach(addr => mem.set(String(addr), value));
}

function initialize(inst, writer) {
    let mem = new Map();
    let mask = "".padStart(36, "X");
    for (let i of inst) {
        if(i.startsWith("mask")) mask = getMask(i);
        else {
            let [addr, value] = getMemValue(i);
            writer(mem, addr, value, mask)
        }
    }
    return mem;
}

console.log(Array.from(initialize(inst, writerV1).values()).reduce((a,b) => a+b)); //part 1
console.log(Array.from(initialize(inst, writerV2).values()).reduce((a,b) => a+b)); //part 2