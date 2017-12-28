const prompt = require("prompt");
const fs = require("fs");
const PassPermutator = require("./passPermutator");
const SecondPassPermutator = require("./secondPassPermutator");
const LedgerPermutator = require("./ledgerPermutator");

const feasabilityWarning = (callback) => {
    console.log("How many words are you missing?");
    prompt.start();
    prompt.get("numMissing", (err, res) => {
        const numMissing = parseInt(res.numMissing);
        if(numMissing > 3)
            console.log("!! Bruteforcing more than 3 words will take an EXTREMELY long time. !! \n!! Proceed at your own peril !!");

        callback();
    });
};

console.log(fs.readFileSync("art.txt", "utf8"));
console.log("Select your issue: ");
console.log("   1) I'm missing words in my passphrase");
console.log("   2) I'm missing words in my second passphrase");
console.log("   3) I'm missing words in my Ledger Nano S recovery seed");
console.log("   4) I'm a dumbass");

const schema = {
    properties: {
        issue: {
            pattern: /^[0-9]*$/,
            message: "Please select an issue number",
            required: true
        }
    }
};

prompt.start();
prompt.get(schema, (err, result) => {
    if(!result || !result.issue)
        return console.log("No issue selected");
    switch(result.issue) { 
        case "1": 
            feasabilityWarning(() => {
                console.log("Please enter your passphrase with the missing words marked with 'x'");
                console.log("For example: fruit x seed toddler knock silver dust amount x lucky lonely x");
                prompt.start();
                prompt.get(["passphrase", "address"], (err, res) => {
                    if(!res)
                        return console.log("Exiting");
                    PassPermutator.start(res.passphrase, res.address).then((pass) => {
                        console.log("============================");
                        console.log("Passphrase recovered!");
                        console.log(pass);
                        console.log("============================");
                    }).catch((e) => console.log("Passphrase not recovered"))
                });
            });
            break;
        case "2":
            feasabilityWarning(() => {
                console.log("Please enter your SECOND passphrase with the missing words marked with 'x'");
                console.log("For example: fruit x seed toddler knock silver dust amount x lucky lonely x");
                prompt.start();
                prompt.get(["passphrase", "address"], (err, res) => {
                    if(!res)
                        return console.log("Exiting");
                    SecondPassPermutator.start(res.passphrase, res.address).then((pass) => {
                        console.log("============================");
                        console.log("Second passphrase recovered!");
                        console.log(pass);
                        console.log("============================");
                    }).catch((e) => console.log("Passphrase not recovered"))
                });
            });
            break;
        case "3":
            feasabilityWarning(() => {
                const schema = {
                    properties: {
                        passphrase: {
                            message: "Please enter your Ledger recovery seed with the missing words marked with 'x'. For example: fruit x seed toddler knock silver dust amount x lucky lonely x",
                            required: true
                        },
                        address: {
                            message: "Please enter your Ark address",
                            required: true
                        },
                        path: {
                            message: "Please enter your Ark address's derivation path (leave empty for default path)",
                            required: false
                        }
                    }
                };

                prompt.start();
                prompt.get(schema, (err, res) => {
                    if(!res)
                        return console.log("Exiting");
                    const path = res.path ? res.path : "44'/111'/0'/0/0";
                    LedgerPermutator.start(res.passphrase, path, res.address).then((pass) => {
                        console.log("============================");
                        console.log("Ledger seed recovered!");
                        console.log(pass);
                        console.log("============================");
                    }).catch((e) => console.log("Ledger seed not recovered"))
                });
            });
            break;
        default:
            console.log("That sucks");
            break;
    }
});