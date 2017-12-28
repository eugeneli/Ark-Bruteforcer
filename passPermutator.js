const arkjs = require("arkjs");
const dict = require("./bip39dictionary");
const cmdArgs = require("command-line-args");
const Combinatorics = require("js-combinatorics");

module.exports.start = (seedString, address) => {
    return new Promise((resolve, reject) => {
        const seedWords = seedString.trim().split(" ");
        const numMissing = seedWords.filter((word) => word == "x").length;

        if(numMissing == 0)
                return reject();
            
        console.log(`Constructing possible permutations for ${numMissing} missing words...`);
        const permutations = Combinatorics.permutation(dict, numMissing);
        const permutationArray = permutations.toArray();
        console.log("Permutation array created, bruteforcing...");

        var recoveredPass;
        for(let i = 0; i < permutationArray.length; i++)
        {
            let perm = permutationArray[i];
            let candidate = seedWords.map((word) => word == "x" ? perm.pop() : word);
            let candidateSeed = candidate.join(" ");

            console.log(candidateSeed);

            let addr = ark.crypto.getAddress(ark.crypto.getKeys(candidateSeed).publicKey);

            if(addr == address)
            {
                recoveredPass = candidateSeed;
                break;
            }
        }

        recoveredPass ? resolve(recoveredPass) : reject();
    });
};
