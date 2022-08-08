const fs = require("fs");
const mnemonic = fs.readFileSync(".secret").toString().trim();
const HDWalletProvider = require("@truffle/hdwallet-provider");
const rpc = 'https://rinkeby.infura.io/v3/your api key'

module.exports = {
  compilers: {
    solc: {
      version: "0.8.2"
    }
  },
  networks: {
    development: {
      host: "127.0.0.1",
      port: 9545,
      network_id: "*"
    },
    ropsten: {
      provider: function () {
        return new HDWalletProvider(mnemonic, rpc)
      },
      network_id: 3,
      gas: 6721975,
      gasPrice: 20000000000
    },
    rinkeby: {
      provider: function () {
        return new HDWalletProvider(mnemonic, rpc)
      },
      network_id: 4,
      gas: 6721975,
      gasPrice: 20000000000
    },
    ganache: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*",
    }
  },
  plugins: [
    'truffle-plugin-verify'
  ],
  api_keys: {
    etherscan: 'your api key'
  }
};
