// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/math/SafeMathUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract CryptoIsland is
    ERC721Upgradeable,
    ERC721EnumerableUpgradeable,
    ERC721URIStorageUpgradeable,
    ERC721BurnableUpgradeable,
    PausableUpgradeable,
    OwnableUpgradeable
{
    // using SafeMathUpgradeable for uint256;
    using CountersUpgradeable for CountersUpgradeable.Counter;

    CountersUpgradeable.Counter private _tokenIdCounter;

    // CountersUpgradeable.Counter private _tokenIds;

    // uint256 public constant MAX_SUPPLY = 1000;
    // uint256 public constant PRICE = 0.01 ether;
    // uint256 public constant MAX_PER_MINT = 1;

    // string public baseTokenURI;

    function initialize() public initializer {
        __ERC721Enumerable_init();
        __ERC721URIStorage_init();
        __ERC721Burnable_init();
        __Pausable_init();
        __Ownable_init();
    }

    // function mintNFTs(uint256 _count) public payable {
    //     uint256 totalMinted = _tokenIds.current();

    //     require(totalMinted.add(_count) <= MAX_SUPPLY, "Not enough NFTs left!");
    //     require(
    //         _count > 0 && _count <= MAX_PER_MINT,
    //         "Cannot mint specified number of NFTs."
    //     );
    //     require(
    //         msg.value >= PRICE.mul(_count),
    //         "Not enough ether to purchase NFTs."
    //     );

    //     for (uint256 i = 0; i < _count; i++) {
    //         _mintSingleNFT();
    //     }
    // }

    // function reserveNFTs() public onlyOwner {
    //     uint256 totalMinted = _tokenIds.current();

    //     require(
    //         totalMinted.add(10) < MAX_SUPPLY,
    //         "Not enough NFTs left to reserve"
    //     );

    //     for (uint256 i = 0; i < 10; i++) {
    //         _mintSingleNFT();
    //     }
    // }

    function safeMint(address to) public payable {
        _safeMint(to, _tokenIdCounter.current());
        _tokenIdCounter.increment();
    }

    function pause() public onlyOwner {
        _unpause();
    }

    function _baseURI() internal pure override returns (string memory) {
        return
            "https://bafybeichhwaivvgtgd6egvkpw274gri44je5cun4aelroxssd2xnlk4fxa.ipfs.nftstorage.link/";
    }

    // function _baseURI() internal view virtual override returns (string memory) {
    //     return baseTokenURI;
    // }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721Upgradeable, ERC721URIStorageUpgradeable)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    // function setBaseURI(string memory _baseTokenURI) public onlyOwner {
    //     baseTokenURI = _baseTokenURI;
    // }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721Upgradeable, ERC721EnumerableUpgradeable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function _burn(uint256 tokenId)
        internal
        override(ERC721Upgradeable, ERC721URIStorageUpgradeable)
    {
        super._burn(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721Upgradeable, ERC721EnumerableUpgradeable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    // function _mintSingleNFT() private {
    //     uint256 newTokenID = _tokenIds.current();
    //     _safeMint(msg.sender, newTokenID);
    //     _tokenIds.increment();
    // }

    function tokensOfOwner(address _owner)
        external
        view
        returns (uint256[] memory)
    {
        uint256 tokenCount = balanceOf(_owner);
        uint256[] memory tokensId = new uint256[](tokenCount);

        for (uint256 i = 0; i < tokenCount; i++) {
            tokensId[i] = tokenOfOwnerByIndex(_owner, i);
        }
        return tokensId;
    }

    function withdraw() public payable onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No ether left to withdraw");

        (bool success, ) = (msg.sender).call{value: balance}("");
        require(success, "Transfer failed.");
    }
}
