const arkjs = require("arkjs");
const dict = require("./bip39dictionary");
const cmdArgs = require("command-line-args");
const Combinatorics = require("js-combinatorics");

var seedString;
var address;
const argDefs = [
    { name: "seed", alias: "s", type: String },
    { name: "address", alias: "a", type: String }
];
const options = cmdArgs(argDefs);

if(!options.seed || !options.address)
{
    console.log("Please enter all required information: seed, Ark address");
    process.exit(1);
}
else
{
    seedString = options.seed;
    address = options.address;
}

const seedWords = seedString.split(" ");
const permutations = Combinatorics.permutation(dict, 2);
const permutationArray = permutations.toArray();
console.log("Permutation array created, bruteforcing...")
permutationArray.forEach((perm) => {
    const candidate = seedWords.map((word) => word == "x" ? perm.pop() : word);
    const candidateSeed = candidate.join(" ");

    console.log(candidateSeed);

    const addr = ark.crypto.getAddress(ark.crypto.getKeys(candidateSeed).publicKey);

    if(addr == address)
    {
        console.log("Seed found!");
        console.log(candidateSeed);
    }
});
