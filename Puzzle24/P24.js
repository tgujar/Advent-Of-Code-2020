const fs = require("fs");
let dirPattern;

try {
    dirPattern = fs.readFileSync("input.txt", "utf-8").toString().split("\n");
} catch (e) {
    console.log('Error:', e.stack);
}

/* 
came up with the coordinate system, and found out it is actually used
see https://www.redblobgames.com/grids/hexagons/#distances
*/
function findTile(pattern) {
    let tile = [0, 0];
    let dir = /e|w|ne|nw|sw|se/g;
    while(move = dir.exec(pattern)) {
        switch(move[0]) {
            case "e": 
                tile = [tile[0] + 2, tile[1]];
                break;
            case "w": 
                tile = [tile[0] - 2, tile[1]];
                break;
            case "nw": 
                tile = [tile[0] - 1, tile[1] + 1];
                break;
            case "sw": 
                tile = [tile[0] - 1, tile[1] - 1];
                break;
            case "ne": 
                tile = [tile[0] + 1, tile[1] + 1];
                break;
            case "se": 
                tile = [tile[0] + 1, tile[1] - 1];
                break;

        }
    }
    return tile.join(",");
}

// find black tiles for set of directions
function findBlack(dirPattern) {
    let black = new Set();
    dirPattern.forEach(pattern => {
        const tile = findTile(pattern);
        if (black.has(tile)) black.delete(tile);
        else black.add(tile);
    });
    return Array.from(black);
}

// moves to get adjacent tiles
const adjacent = [[-2, 0], [2, 0], [-1, -1], [1, 1], [1, - 1], [-1, 1]];

// get adjacent tiles for a tile
const getAdjacents = (pair) => {
    const [row, col] = pair.split(",").map(e => Number(e));
    return adjacent.reduce((adjacents, move) => {
        return adjacents.concat([move[0] + row, move[1] + col].join(","));
    }, []);
}

// get an array of black tiles for any given day
function getExhibit(initBlack, day) {

    if (day === 0) return initBlack;
    const dayTiles = []; 

    initBlack.forEach(pair => {
        const adjs = getAdjacents(pair);
        const adjWhites = adjs.filter(tile => !initBlack.includes(tile) && !dayTiles.includes(tile));

        const numAdjBlacks = adjs.filter(tile => initBlack.includes(tile)).length;
        if (numAdjBlacks > 0 && numAdjBlacks < 3) dayTiles.push(pair); // add to next iter

        adjWhites.forEach(adj => {
            adjToWhite = getAdjacents(adj); // get adjacents to white tile
            if (adjToWhite.filter(tile => initBlack.includes(tile)).length === 2) {
                dayTiles.push(adj); // add to next iteration, if 2 black tiles are adjacent
            }
        });  
    })

    return getExhibit(dayTiles, day - 1);
}

const blackTiles = findBlack(dirPattern);
console.log(blackTiles.length); // part 1
console.log(getExhibit(blackTiles, 100).length); // part 2