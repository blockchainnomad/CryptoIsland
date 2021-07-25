pragma solidity >=0.4.24;

import 'zeppelin-solidity/contracts/ownership/Ownable.sol';
import 'zeppelin-solidity/contracts/token/ERC721/ERC721Token.sol';

contract NFToken is ERC721Token, Ownable {
  uint8 public decimals = 0;

  /*** EVENTS ***/
  /// The event emitted (useable by web3) when a token is purchased
  event BoughtToken(address indexed buyer, uint256 tokenId);

  /*** CONSTANTS ***/
  uint8 constant TITLE_MIN_LENGTH = 1;
  uint8 constant TITLE_MAX_LENGTH = 64;

  /*** DATA TYPES ***/

  /// Price set by contract owner for each token in Wei.
  /// @dev If you'd like a different price for each token type, you will
  ///   need to use a mapping like: `mapping(uint256 => uint256) tokenTypePrices;`
  uint256 currentPrice = 0;

  /// The token type (1 for shield, 2 for sword, etc)
  mapping(uint256 => uint256) tokenTypes;

  /// The title of the token
  mapping(uint256 => string) tokenTitles;

  constructor() ERC721Token("CryptoIsland NFToken", "NFT") public {
    // any init code when you deploy the contract would run here
  }

  function buyToken (uint256 _type, string _title) external payable {
    bytes memory _titleBytes = bytes(_title);
    require(_titleBytes.length >= TITLE_MIN_LENGTH, "Title is too short");
    require(_titleBytes.length <= TITLE_MAX_LENGTH, "Title is too long");

    require(msg.value >= currentPrice, "Amount of Ether sent too small");

    uint256 index = allTokens.length + 1;

    _mint(msg.sender, index);

    tokenTypes[index] = _type;
    tokenTitles[index] = _title;

    emit BoughtToken(msg.sender, index);
  }

  /**
   * @dev Returns all of the tokens that the user owns
   * @return An array of token indices
   */
  function myTokens()
    external
    view
    returns (
      uint256[]
    )
  {
    return ownedTokens[msg.sender];
  }

  /// @notice Returns all the relevant information about a specific token
  /// @param _tokenId The ID of the token of interest
  function getToken(uint256 _tokenId)
    external
    view
    returns (
      uint256 tokenType_,
      string tokenTitle_
  ) {
      tokenType_ = tokenTypes[_tokenId];
      tokenTitle_ = tokenTitles[_tokenId];
  }

  /// @notice Allows the owner of this contract to set the currentPrice for each token
  function setCurrentPrice(uint256 newPrice)
    public
    onlyOwner
  {
      currentPrice = newPrice;
  }

  /// @notice Returns the currentPrice for each token
  function getCurrentPrice()
    external
    view
    returns (
    uint256 price
  ) {
      price = currentPrice;
  }

}
