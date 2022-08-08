const CryptoIsland = artifacts.require("CryptoIsland");

module.exports = async function (deployer, network, accounts) {
  await deployer.deploy(CryptoIsland).then(instance => {
    console.log('ABI: ', JSON.stringify(instance.abi))
  })
};