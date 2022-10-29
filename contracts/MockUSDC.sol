//SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockUSDC is ERC20 {
   
    constructor() ERC20("USDC", "USDC") {
        _mint(msg.sender, 10000000); //mint 10 USDC
    }

    function decimals() public view virtual override returns (uint8) {
        return 6;
    }

}