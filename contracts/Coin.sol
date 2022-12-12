//SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Coin is ERC20, Ownable {

    //value in usdc
    uint256 public value;
   
    constructor(string memory name, string memory symbol, uint256 _value) ERC20(name, symbol) {
        value = _value;
    }

    function decimals() public view virtual override returns (uint8) {
        return 0;
    }

    function mint(address _user, uint256 _amount) external onlyOwner {
        _mint(_user, _amount);
    }

    function burn(address _user, uint256 _amount) external onlyOwner {
        _burn(_user, _amount);
    }

}