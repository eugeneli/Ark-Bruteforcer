const arkjs = require("arkjs");
const arkApi = require("ark-api");
const dict = require("./bip39dictionary");
const cmdArgs = require("command-line-args");
const Combinatorics = require("js-combinatorics");

const getSecondPubKey = (addr) => {
    return new Promise((resolve, reject) => {
        arkApi.getAccount(addr, (err, succ, resp) => {
            if(!resp)
                return reject(`Error getting account info: ${err}`);

            const secondPublicKey = resp.account.secondPublicKey;
            if(!secondPublicKey)
                return reject("Account has no second passphrase");

            resolve(secondPublicKey);
        });
    });
};

module.exports.start = (secondPassString, address) => {
    arkApi.setPreferredNode("node1.arknet.cloud");
    arkApi.init("main");
    return new Promise((resolve, reject) => {
        getSecondPubKey(address).then((secondPublicKey) => {
            const seedWords = secondPassString.trim().split(" ");
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

                let publicKey = ark.crypto.getKeys(candidateSeed).publicKey;

                if(publicKey == secondPublicKey)
                {
                    recoveredPass = candidateSeed;
                    break;
                }
            }

            recoveredPass ? resolve(recoveredPass) : reject();
        });
    });
};
