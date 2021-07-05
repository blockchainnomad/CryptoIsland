var CryptoIsland = artifacts.require("CryptoIsland");
var NFToken = artifacts.require("NFToken");
var Owned = artifacts.require("Owned");

module.exports = function(deployer) {
  deployer.deploy(CryptoIsland);
  deployer.deploy(NFToken);
  deployer.deploy(Owned);
};