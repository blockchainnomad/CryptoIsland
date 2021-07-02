  pragma solidity >=0.4.24;

contract CryptoIsland {
    address[16] public buyers;

    // Buying an art
    function buy(uint artId) public returns (uint) {
        require(artId >= 0 && artId <= 15);

        buyers[artId] = msg.sender;

        return artId;
    }

    // Retrieving the buyers
    function getBuyers() public view returns (address[16] memory) {
        return buyers;
    }

}

