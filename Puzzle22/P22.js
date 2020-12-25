// Puzzle available at https://adventofcode.com/2020/day/22

const fs = require('fs');
let deck1, deck2;
try {
    let data = fs.readFileSync('input.txt', 'utf8');
    [deck1, deck2] = data.toString().split("\n\n").map(deck => {
        return deck.split("\n").slice(1).map(card => Number(card));
    })
} catch (e) {
    console.log('Error:', e.stack);
}

const decksOnWin  = (deck1, deck2, deck2Winner) => {
    const cards = [deck1[0], deck2[0]];
    return deck2Winner ?
    [deck1.slice(1), deck2.slice(1).concat(cards.reverse())] : 
    [deck1.slice(1).concat(cards), deck2.slice(1)]
}

const getWinner = (deck1, deck2) => {
    if (deck1.length !== 0 && deck2.length !== 0) return null;
    return deck1.length === 0 ? 1 : 0;
}

const winnerScore  = (deck1, deck2) => {
    const winnerDeck = getWinner(deck1, deck2) ? deck2 : deck1;
    return winnerDeck.reduce((score, card, idx) => score + card*(winnerDeck.length - idx), 0);
}

function combat(deck1, deck2) {
    if (deck1.length === 0 || deck2.length === 0) return [deck1, deck2];
    return combat(...decksOnWin(deck1, deck2, deck2[0] > deck1[0]));
}

// I believe this is correct algo, however it exceeds the maximum call stack size :(
function recurCombat(deck1, deck2, mem = []) {
    if (mem.includes(JSON.stringify([deck1, deck2]))) {
        return [deck1, []];
    } else if (deck1.length === 0 || deck2.length === 0) {
        return [deck1, deck2];
    }

    mem.push(JSON.stringify([deck1, deck2]));
    if (deck1[0] <= deck1.length - 1 && deck2[0] <= deck2.length - 1) {
        const nextGameWinner = getWinner(...recurCombat(
            deck1.slice(1, 1 + deck1[0]),
            deck2.slice(1, 1 + deck2[0])));
        [deck1, deck2] = decksOnWin(deck1, deck2, nextGameWinner);
    } else {
        [deck1, deck2]  = decksOnWin(deck1, deck2, deck2[0] > deck1[0]);
    }
    return recurCombat(deck1, deck2, mem);
}

function combatRound(deck1, deck2, mem) {
    mem.push(JSON.stringify([deck1, deck2]));
    if (deck1[0] <= deck1.length - 1 && deck2[0] <= deck2.length - 1) {
        const nextGameWinner = getWinner(...iterCombat(
            deck1.slice(1, 1 + deck1[0]),
            deck2.slice(1, 1 + deck2[0])));
        [deck1, deck2] = decksOnWin(deck1, deck2, nextGameWinner);
    } else {
        [deck1, deck2]  = decksOnWin(deck1, deck2, deck2[0] > deck1[0]);
    }
    return [deck1, deck2, mem];
}

function iterCombat(deck1, deck2, mem = []) {
    const gameEnd  = (deck1, deck2, mem) => {
        if (mem.includes(JSON.stringify([deck1, deck2]))) {
            return [deck1, []];
        } else if (deck1.length === 0 || deck2.length === 0) {
            return [deck1, deck2];
        }
    }
    while(!gameEnd(deck1, deck2, mem)) {
        [deck1, deck2, mem] = combatRound(deck1, deck2, mem);
    }
    return [deck1, deck2]
}


console.log(winnerScore(...combat(deck1, deck2))); // part 1
//console.log(winnerScore(...recurCombat(deck1, deck2)));
console.log(winnerScore(...iterCombat(deck1, deck2))); // part 2, same code as recursive, but expressed as iterative :)