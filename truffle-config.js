const HDWalletProvider = require("@truffle/hdwallet-provider");
const mnemonic = "your ethereum wallet mnemonic";

module.exports = {
  compilers: {
    solc: {
      version: "^0.4.24"
    } 
  },
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },
    ropsten: {
      provider: function() {
        return new HDWalletProvider(mnemonic, "https://ropsten.infura.io/v3/your project id")
      },
      network_id: 3
    }
  }
};
