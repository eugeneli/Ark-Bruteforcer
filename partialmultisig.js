const arkjs = require("arkjs");
const request = require("request");
const cmdArgs = require("command-line-args");
const Combinatorics = require("js-combinatorics");

const addr = "AeavKitM5w7F9BHt7xpHXJZqP7Da6frgXz";
const pass = "purse cute crazy record come capable tomorrow bleak smoke hurt lava tray";
const last4 = "inform awful dinner filter";
const bank = ["honest", "purpose", "bicycle", "recycle", "castle", "sibling", "strategy", "toast", "volcano", "umbrella", "peanut", "crane", "clown", "alarm", "brick", "soldier", "fridge", "olympic", "calm"];

const attemptTxSend = (tx, pass) => {
    const callback = (pass, error, response, body) => {
        console.log(body);
        if(body && body.error != "Failed to verify second signature")
        {
            console.log(`Missing phrase found: ${pass}`);
            process.exit(1);
        }
    };

    request({
      url: "https://api.arknode.net/peer/transactions",
      json: { transactions: [tx] },
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "os": "linux3.2.0-4-amd64",
        "version": "0.3.0",
        "port": 1,
        "nethash": "6e84d08bd299ed97c212c886c98a57e36545c8f5d645ca7eeae63a8bd62d8988"
      }
    }, (e, r, b) => callback(pass, e, r, b));
};

const combos = Combinatorics.bigCombination(bank, 8).toArray();

const testPass = () => {
    const c = combos.pop();
    const secPass = c.join(" ") + " " + last4;
    const tx = ark.transaction.createTransaction("AKdr5d9AMEnsKYxpDcoHdyyjSCKVx3r9Nj", 9999999999999999, null, pass, secPass);

    console.log(`Testing: ${secPass}`);
    attemptTxSend(tx, secPass);

    setTimeout(testPass, 5);
};
testPass();
