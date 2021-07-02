var CryptoIsland = artifacts.require("CryptoIsland");
var NFToken = artifacts.require("NFToken");

module.exports = function(deployer) {
  deployer.deploy(CryptoIsland);
  deployer.deploy(NFToken);
};