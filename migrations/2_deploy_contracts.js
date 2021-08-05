var CryptoIslandToken = artifacts.require("CryptoIslandToken");

module.exports = function(deployer) {
  deployer.deploy(CryptoIslandToken);
};