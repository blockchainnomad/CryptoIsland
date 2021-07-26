const HDWalletProvider = require("@truffle/hdwallet-provider");
const mnemonic = "walk tiger leopard beauty exclude tree write inhale nice just foster gown";

module.exports = {
  compilers: {
    solc: {
      version: ">=0.6.0 <0.9.0"
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
        return new HDWalletProvider(mnemonic, "https://ropsten.infura.io/v3/a269b3fad4fc4036a44bd481643c4092")
      },
      network_id: 3
    }
  }
};
