const HDWalletProvider = require("@truffle/hdwallet-provider");
const mnemonic = "your wallet mnemonic"
module.exports = {
  compilers: {
    solc: {
      version: "0.5.0"
    } 
  },
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*" // Match any network id
    },
    ropsten: {
      provider: function() {
        return new HDWalletProvider(mnemonic, "https://ropsten.infura.io/v3/your project id")
      },
      network_id: 3,
      gas: 6721975,
      gasPrice: 20000000000
    },
    ganache: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*",
    }
  }
};
