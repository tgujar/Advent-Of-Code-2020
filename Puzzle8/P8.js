// Puzzle available at https://adventofcode.com/2020/day/8

const fs = require('fs');
let prog;

try {
    const data = fs.readFileSync('input.txt', 'utf-8');
    prog = data
            .toString()
            .split("\n")
            .map(inst => {
                const [func, arg] = inst.split(" ");
                return {func, arg: Number(arg)}; // {func: "jmp", arg: 123}
            });
} catch (e) {
    console.log('Error:', e.stack);
}

const commands = {
    acc: (idx, acc, arg) => [acc + arg, idx + 1],
    jmp: (idx, acc, arg) => [acc, idx + arg],
    nop: (idx, acc) => [acc, idx + 1] 
}

class State {
    constructor(acc = 0) {
        this.acc = acc;
        this.visited = [0]; // program starts at 0
    }
    addVisited(idx) {
        this.visited.push(idx)
    }
    get lastVisited() {
        return this.visited[this.visited.length - 1];
    }
}

function runProgram(prog, state) {
    let i = 0;
    while(i < prog.length) {
        let inst = prog[i]; // get instruction
        [state.acc, i] = commands[inst.func](i, state.acc, inst.arg); // execute inst and update acc
        if (state.visited.includes(i)) break; // if already visited, its an infinite loop
        state.addVisited(i);
    }
    return state;
}

function fixProgram(prog) {
    const fixed = (idx) => idx >= prog.length; // if idx >= program length then there is no infinite loop
    const finalState = runProgram(prog, new State());  // run it once on original input

    // switch nop to jmp or jmp to nop
    const switchInst = (command) => {
        if (command.func === "jmp") {
            return {func: "nop", arg: command.arg};
        } else {
            return {func: "nop", arg: command.arg};
        }
    }
    const isNOPJMP = (command) => command.func === "jmp" || command.func === "nop";

    /* the invalid instruction must be a part of the instructions actually executed
        in the original program. */
    for (let i of finalState.visited) {
        if (!isNOPJMP(prog[i])) continue; // if not nop or jmp, then inst is correct, DONT CHANGE IT!!
        const modifiedProg = prog.slice(0, i).concat(switchInst(prog[i]), prog.slice(i+1)); 
        let trial = runProgram(modifiedProg, new State()); 
        if (fixed(trial.lastVisited)) {
            // check if the modified program terminates i.e no infinite loop
            return { program: modifiedProg,state: trial }; 
        } 
    }
}

console.log(runProgram(prog, new State()).acc); // part 1
console.log(fixProgram(prog).state.acc); // part 2