const arkjs = require("arkjs");
const bip39 = require("bip39");
const cmdArgs = require("command-line-args");
const Combinatorics = require("js-combinatorics");

var seedString;
var wordsString;
var address;
const argDefs = [
    { name: "seed", alias: "s", type: String },
    { name: "words", alias: "w", type: String },
    { name: "address", alias: "a", type: String }
];
const options = cmdArgs(argDefs);
 
if(!options.seed || !options.words || !options.address)
{
    console.log("Please enter all required information: seed, jumbled words, Ark address");
    process.exit(1);
}
else
{
    seedString = options.seed;
    wordsString = options.words;
    address = options.address;
}

//validate inputs, make sure number of jumble words equals number of missing in seed
const seedWords = seedString.split(" ");
const jumbledWords = wordsString.split(" ");
const numMissing = seedWords.filter((word) => word == "x").length;
if(numMissing != jumbledWords.length)
{
    console.log("Make sure the number of missing words (x's) is equal to the number of candidate words");
    process.exit();
}

const permutations = Combinatorics.permutation(jumbledWords);
permutations.toArray().forEach((jumble) => {
    const candidate = seedWords.map((word) => word == "x" ? jumble.pop() : word);
    const candidateSeed = candidate.join(" ");

    const hdnode = arkjs.HDNode.fromSeedHex(bip39.mnemonicToSeedHex(candidateSeed));
    const keys = hdnode.derivePath("44'/111'/0'/0/0").keyPair;
    const addr = keys.getAddress();

    if(addr == address)
    {
        console.log("Seed found!");
        console.log(candidateSeed);
    }
});
