//SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./Coin.sol";

contract ChangeMachine {
   
    Coin public Quarter;
    Coin public Dime;
    Coin public Nickel;
    Coin public Penny;
    IERC20 public USDC;
    uint256 public balance;

    constructor(address _usdc)  {
        USDC = IERC20(_usdc);
        Quarter = new Coin("Quarter", "QUARTER", 250000);
        Dime = new Coin("Dime", "DIME", 100000);
        Nickel = new Coin("Nickel", "NICKEL", 50000);
        Penny = new Coin("Penny", "PENNY", 10000);
    }

    function countChange() view public returns(uint256 amount) {
        return _countChange(
            Quarter.balanceOf(msg.sender),
            Dime.balanceOf(msg.sender),
            Nickel.balanceOf(msg.sender),
            Penny.balanceOf(msg.sender)
        );
    }

    function giveChange(uint256 _amount) external  returns(uint256 leftOverAmount) {
        require(USDC.balanceOf(msg.sender) >= _amount, "Not enough USDC");
        leftOverAmount = _giveCoins(_amount, Quarter);
        leftOverAmount = _giveCoins(leftOverAmount, Dime);
        leftOverAmount = _giveCoins(leftOverAmount, Nickel);
        leftOverAmount = _giveCoins(leftOverAmount, Penny);
        return leftOverAmount;
    }

    function giveQuarters(uint256 _amount) external returns(uint256 leftOverAmount) {
        require(USDC.balanceOf(msg.sender) >= _amount, "Not enough USDC");
        return _giveCoins(_amount, Quarter);
    }

    function giveDimes(uint256 _amount) external returns(uint256 leftOverAmount) {
        require(USDC.balanceOf(msg.sender) >= _amount, "Not enough USDC");
        return _giveCoins(_amount, Dime);
    }

    function giveNickels(uint256 _amount) external returns(uint256 leftOverAmount) {
        require(USDC.balanceOf(msg.sender) >= _amount, "Not enough USDC");
        return _giveCoins(_amount, Nickel);
    }

    function givePennies(uint256 _amount) external returns(uint256 leftOverAmount) {
        require(USDC.balanceOf(msg.sender) >= _amount, "Not enough USDC");
        return _giveCoins(_amount, Penny);
    }

    function cashOut(uint256 _quarters, uint256 _dimes, uint256 _nickels, uint256 _pennies) public {
        require(Quarter.balanceOf(msg.sender) >= _quarters, "Not enough quarters");
        require(Dime.balanceOf(msg.sender) >= _dimes, "Not enough dimes");
        require(Nickel.balanceOf(msg.sender) >= _nickels, "Not enough nickels");
        require(Penny.balanceOf(msg.sender) >= _pennies, "Not enough pennies");
        uint256 amount = _countChange(_quarters, _dimes, _nickels, _pennies);
        Quarter.burn(msg.sender, _quarters);
        Dime.burn(msg.sender, _dimes);
        Nickel.burn(msg.sender, _nickels);
        Penny.burn(msg.sender, _pennies);
        balance -= amount;
        USDC.transferFrom(address(this), msg.sender, amount);

    }

    function cashOutAll() external {
        cashOut(
            Quarter.balanceOf(msg.sender),
            Dime.balanceOf(msg.sender),
            Nickel.balanceOf(msg.sender),
            Penny.balanceOf(msg.sender)
        );
    }

    function _giveCoins(uint256 _amount, Coin _coin) internal returns(uint256 leftOverAmount) {
        uint256 coinAmount = _amount / _coin.value();
        leftOverAmount = _amount % _coin.value();
        balance += _amount - leftOverAmount;
        USDC.transferFrom(msg.sender, address(this), _amount - leftOverAmount);
        _coin.mint(msg.sender, coinAmount);
        return leftOverAmount;
    }

    function _countChange(uint256 _quarters, uint256 _dimes, uint256 _nickels, uint256 _pennies) internal view returns(uint256 amount) {
        return 
            _quarters * Quarter.value() +
            _dimes * Dime.value() +
            _nickels * Nickel.value() +
            _pennies * Penny.value()
        ;
    }

}