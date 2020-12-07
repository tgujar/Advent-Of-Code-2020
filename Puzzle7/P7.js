// Puzzle available at https://adventofcode.com/2020/day/7

const fs = require('fs');
let bags;

try {
    const data = fs.readFileSync('input.txt', 'utf8');
    bags = data
        .toString()
        .split("\n") // get lines
        .map(st => {
            // remove "bags, ., bag" from the string
            let [container, content] = st.replace(/bags?\.?/g, "").split("contain");
            return {
                name: container.trim(), // name of container bag
                contents: content
                    // contents as string
                    .split(",")
                    // map strings into objects 
                    .map(bag => {
                        const num = parseInt(bag); // qunatity
                        if (!num) return null // if no bags
                        // remove numbers ans spaces to get bag name
                        const name = bag.replace(/[0-9]/g, "").trim();
                        return { [name]: num };
                    })
                    // combine objects
                    .reduce((acc, item) => {
                        return { ...acc, ...item }
                    })
            }
        })
} catch (e) {
    console.log('Error:', e.stack);
}

// algo is slow because same containers are get searched over and over
function countContainers(bags, toFind) {
    function iterContainer(container) {
        // if container has other bags and toFind inside container
        if (container.contents && toFind in container.contents) return true; 
        for (let bag in container.contents) {
            let nextBag = bags.find(({ name }) => name === bag); // find conatiner with name "bag"
            if (iterContainer(nextBag)) {
                // if nextBag contains toFind, then return true
                return true;
            }
        }
        return false;
    }
    // count the total container bags which contain toFind
    return bags.reduce((count, bag) => iterContainer(bag) ? count + 1 : count, 0);
}

const union = (setA, setB) => {
    let _union = new Set(setA);
    for (let elem of setB) {
        _union.add(elem);
    }
    return _union;
}

function findContainersFast(bags, toFind) {
    let containers = new Set();
    for (let bag of bags) {
        // if bag contains contents and toFind inside bag
        if (bag.contents && toFind in bag.contents) {
            containers.add(bag.name); // add the bag name to containers
            /* replace containers with the union of original set and
             a set containing the containers of the bag. This is so because,
             bag conatins toFind, thus, the containers of bag also contain toFind
            */
            containers = union(containers, findContainersFast(bags, bag.name));
        }
    }
    return containers;
}

function countContents(bags, container) {
    const c = bags.find(({ name }) => name === container); // get container from its name
    if (!c.contents) return 0; // if no bags inside c, then return 0
    return Object
        .keys(c.contents)
        .reduce((acc, bag) => {
            /* add the total bags of a kind(bok) and the product of
            bok and the sum of its contents to accumulator(acc) 
            */
            return acc + c.contents[bag] + c.contents[bag] * countContents(bags, bag);
        }, 0);
}

console.log(findContainersFast(bags, "shiny gold").size); // part 1
console.log(countContainers(bags, "shiny gold")); // part 1 (slow)
console.log(countContents(bags, "shiny gold")); // part 2
