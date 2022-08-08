var CryptoIsland = artifacts.require("CryptoIsland");

module.exports = function (deployer) {
  deployer.deploy(CryptoIsland, "https://bafybeihfqpmyx4oswe4srwah6u33vvdy2tddz4ynelceaevhonrjkg6zdq.ipfs.nftstorage.link/").then(instance => {
    console.log('ABI: ', JSON.stringify(instance.abi))
  })
};