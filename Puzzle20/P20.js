const fs = require('fs');
const tiles = {};
try {
    let data = fs.readFileSync('input.txt', 'utf8');
    data.toString().split("\n\n").forEach(elem => {
        let [id, tileArr] = elem.split(":\n");
        id = id.match(/\d+/g);
        tileArr = tileArr.split("\n");
        tiles[id] = { edges: getEdges(tileArr), tile: tileArr };
    });
} catch (e) {
    console.log('Error:', e.stack);
}

/*                      e1
                         _
Edges are stored as e4  |_|   e2, and in array as [e1,e2,e3,e4]
                            
                        e3
 */

function getEdges(tileArr) {
    e1 = tileArr[0];
    e3 = tileArr[tileArr.length - 1];
    e2 = tileArr.map(row => row[row.length - 1]).join("");
    e4 = tileArr.map(row => row[0]).join("");
    return [e1, e2, e3, e4];
}

const edgeCombos = (edge) => [edge, edge.split("").reverse().join("")];

function findPieces(tiles) {
    let pieces = { corners: [], edges: [], middle: [] };
    let allEdges = Object.keys(tiles).reduce((all, id) => all.concat(tiles[id].edges), []);
    for (let id in tiles) {
        // filter out edges which are not a part of the current tile 
        const filtLen = allEdges.filter(edge => {
            return !tiles[id].edges
                .reduce((combos, edge) => combos.concat(edgeCombos(edge)), [])
                .includes(edge);
        }).length;

        if (filtLen === allEdges.length - 6) { // corner tile, 4 edges of the current tile and 2 shared by others
            pieces.corners.push(id);
        } else if (filtLen === allEdges.length - 7) { // edge tile, 4 edges of the current tile and 3 shared by others
            pieces.edges.push(id);
        } else { // tiles which are not corners or edges
            pieces.middle.push(id);
        }
    }
    return pieces;
}

function transpose(tileArr) { // transpose of a tile
    return tileArr.reduce((cols, row) => {
        row.split("").forEach((rowElem, idx) => cols[idx] = (cols[idx] || "") + rowElem)
        return cols;
    }, [])
}

function flipVert(tileArr) { // flip a tile vertically
    return transpose(transpose(tileArr).map(str => str.split("").reverse().join("")));
}

function flipHor(tileArr) { // flip tile horizontally
    return tileArr.map(str => str.split("").reverse().join(""));
}

function rotate(tileArr, num) { // rotate a tile "num" times
    if (num === 0) return tileArr
    const colRev = tileArr.map(row => row.split("")).reverse();
    return rotate(new Array(colRev.length)
        .fill(null)
        .map((_, idx) => colRev.reduce((row, elem) => row + elem[idx], "")), num - 1);
}

function getOtherPieceWithEdge(tileId, tiles, edge) {
    const edgeComb = edgeCombos(edge);
    return Object.keys(tiles).find(id => {
        if (id === tileId) return false;
        return tiles[id].edges.some(edge => edgeComb.includes(edge));
    }) || null;
}

function generateCombinations(tileArr) {
    const fVert = flipVert(tileArr);
    const fHor = flipHor(tileArr);
    const fVH = flipVert(flipHor(tileArr));
    const fHV = flipHor(flipVert(tileArr));

    // return rotations of flips
    return [fVert, fHor, fVH, fHV].reduce((combinations, tile) => {
        return combinations.concat([tile, rotate(tile, 1), rotate(tile, 2), rotate(tile, 3)]);
    }, [])
}

function tryCombinations(tileArr, e1, e4) { // return a combination which matches e1 and e4
    return generateCombinations(tileArr).find(combo => {
        const edges = getEdges(combo);
        return e1.includes(edges[0]) && e4.includes(edges[3]);
    });
}

function resolvePicture(tiles) {
    const {corners} = findPieces(tiles);
    const allEdges = Object.keys(tiles).reduce((all, id) => all.concat(tiles[id].edges), [])
    function alignTile(tileData, row, col, picture) {
        const borderEdges = tileData.edges.reduce((nulls, edge) => {
            const edgeCombo = edgeCombos(edge);
            return allEdges.filter(e => !edgeCombo.includes(e)).length === allEdges.length - 1 ?
                nulls.concat(edgeCombo) : nulls;
        }, []);

        const e1Match = row - 1 < 0 ? borderEdges : picture[row - 1][col].edges[2];
        const e4Match = col - 1 < 0 ? borderEdges : picture[row][col - 1].edges[1];

        tileData.tile = tryCombinations(tileData.tile, e1Match, e4Match); // set matching tile combination
        tileData.edges = getEdges(tileData.tile); // calculate tile edges
        return tileData;
    }

    function fillPicture(picture, ...remaining) {
        if (remaining.length === 0) return picture; // no remaining tiles to be filled
        let t = remaining[0]; // get first remaining tile

        // return if already included in picture
        if(picture[t.row] && picture[t.row][t.col]) return fillPicture(picture, ...remaining.slice(1));

        const tileData = alignTile(tiles[t.id], t.row, t.col, picture); // get aligned tile
        if (!picture[t.row]) picture[t.row] = []; // add row, if not yet added
        picture[t.row][t.col] = {id: t.id, ...tileData};

        const right = getOtherPieceWithEdge(t.id, tiles, tileData.edges[1]) // match a piece with edge e2
        const down = getOtherPieceWithEdge(t.id, tiles, tileData.edges[2]) // match a piece with edge e3

        if (right) remaining.push({id: right, row: t.row, col: t.col + 1});
        if (down) remaining.push({id: down, row: t.row + 1, col: t.col});
        return fillPicture(picture, ...remaining.slice(1)); // fill rest of the tiles
    }

    return fillPicture([], { id: corners[0], row: 0, col: 0 }) // get aligned tiles
        // remove borders
        .map(row => { 
            return row.map(({tile}) => {
                return tile.slice(1, tile.length - 1).map(str => str.slice(1, str.length - 1));
            })
        })
        // combine rows to get picture
        .reduce((picture, row) => {
            return picture.concat(row.reduce((lines, tile) => {
                for (let i = 0; i < tile.length; i++) {
                    lines[i] = lines[i] + tile[i]; 
                }
                return lines;
            }));
        }, []);
}

function calculateRoughness(picture) {
    const pictureCombos = generateCombinations(picture); // rotations and flips of picture
    const monsterSize = 15; // number of "#" signs in the monster
    const isMonster = (row, col, picture) => {
        let monsterIdx = [
            [col],
            [col-1,col,col+1,col-6,col-7,col-12,col-13,col-18],
            [col-17, col-14, col-11, col-8, col-5, col-2]
        ]
        for (let i = 0; i < 3; i++) {
            if (monsterIdx[i].some(idx => idx < 0 || idx > picture[0].length - 1)) return false;
            if(!monsterIdx[i].every(idx => picture[row+i][idx] === "#")) {
                return false;
            }
        }
        return true;
    };

    let monsters = 0;
    for (let picture of pictureCombos) {  
        for (let row = 0; row < picture.length - 2; row++) {
            for (let col = 0; col < picture[0].length; col++) {
                if (isMonster(row, col, picture)) {
                    monsters++;
                }
            }
        }
        if(monsters) {
            return picture
                .reduce((hashes, row) => row.split("").filter(e => e === "#").length + hashes, 0) - monsterSize * monsters;
        }
    }
}

const { corners } = findPieces(tiles);
console.log(corners.reduce((prod, corner) => prod * Number(corner), 1)); // part 1

let picture = resolvePicture(tiles);
console.log(calculateRoughness(picture)); // part 2
