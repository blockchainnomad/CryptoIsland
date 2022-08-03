const CryptoIsland = artifacts.require("CryptoIsland");

contract("CryptoIsland", function (/* accounts */) {
  it("should assert true", async function () {
    await CryptoIsland.deployed();
    return assert.isTrue(true);
  });
});
