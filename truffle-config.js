const HDWalletProvider = require("@truffle/hdwallet-provider");
const mnemonic = "your ethereum wallet mnemonic";

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // for more about customizing your Truffle configuration!
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },
    develop: {
      port: 8545
    },
    ropsten: {
      provider: function() {
        return new HDWalletProvider(mnemonic, "https://ropsten.infura.io/v3/your infura project id")
      },
      network_id: 3
    }
  }
};
