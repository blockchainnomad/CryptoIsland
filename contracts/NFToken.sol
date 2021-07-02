pragma solidity >=0.4.24;

import 'zeppelin-solidity/contracts/token/ERC20/StandardToken.sol';

contract NFToken is StandardToken {
  
  string public name = "NFToken";
  string public symbol = "WOO";
  uint8 public decimals = 10;
  uint public INITIAL_SUPPLY = 10000000000;
  
  function NFToken() public {
    totalSupply_ = INITIAL_SUPPLY;
    balances[msg.sender] = INITIAL_SUPPLY;
    }
}

