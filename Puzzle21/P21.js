// Puzzle available at https://adventofcode.com/2020/day/21

const fs = require('fs');
let list;
let ingreds = [];
try {
    let data = fs.readFileSync('input.txt', 'utf8');
    list = data.toString().split("\n").reduce((list, row) => {
        const allergens = row.match(/\(contains(.*)\)/)[1].replace(/\s/g, "").split(",");
        const ingredients = row.split(" (")[0].split(" ");
        ingreds = ingreds.concat(ingredients);
        return list.concat({ingredients: new Set(ingredients), allergens})
    }, []);
} catch (e) {
    console.log('Error:', e.stack);
}

function intersection(setA, setB) {
    let _intersection = new Set()
    for (let elem of setB) {
        if (setA.has(elem)) {
            _intersection.add(elem)
        }
    }
    return _intersection
}

function union(setA, setB) {
    let _union = new Set(setA)
    for (let elem of setB) {
        _union.add(elem)
    }
    return _union
}

function difference(setA, setB) {
    let _difference = new Set(setA)
    for (let elem of setB) {
        _difference.delete(elem)
    }
    return _difference
}

function resolveIngredients(list) {
    let allrgMap = list.reduce((allrgMap, {ingredients, allergens}) => {
        allergens.forEach(allergen => {
            if (l = allrgMap.get(allergen)) {
                allrgMap.set(allergen, intersection(l, ingredients));
            } else {
                allrgMap.set(allergen, ingredients);
            }
        });
        return allrgMap;
    }, new Map());

    let resolveClashes = (allrgList, map = new Map()) => {
        if (allrgList.length === 0) return map;
        allrgList = allrgList.sort((a, b) => a[1].size - b[1].size);
        if (allrgList[0][1].size !== 1) throw new Error("can't be resolved");
        map.set(allrgList[0][0], allrgList[0][1]);
        return resolveClashes(allrgList.slice(1).map(([allergen, ing]) => {
            return [allergen, difference(ing, allrgList[0][1])];
        }), map);
    }

    allrgMap = resolveClashes(Array.from(allrgMap));
    let inert = difference(new Set(ingreds), 
        Array.from(allrgMap.values()).reduce((uni, set) => union(uni, set), new Set()));
    
    return {allrgMap, inert}
}

let {allrgMap, inert} = resolveIngredients(list);
console.log(ingreds.reduce((count, ing) => inert.has(ing) ? count + 1: count, 0)); //part 1

console.log(Array.from(allrgMap)
    .sort((a, b) => a[0] < b[0] ? -1 : 1)
    .map(row => Array.from(row[1])[0]).join(",")
); // part 2
