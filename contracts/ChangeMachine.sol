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

    event Change(address indexed _user, uint256 _toChange, uint256 _changed, uint256 _leftOver);
    event CashOut(address indexed _user, uint256 _toCashOut);

    constructor(address _usdc)  {
        USDC = IERC20(_usdc);
        Quarter = new Coin("Quarter", "QUARTER", 250000);
        Dime = new Coin("Dime", "DIME", 100000);
        Nickel = new Coin("Nickel", "NICKEL", 50000);
        Penny = new Coin("Penny", "PENNY", 10000);
    }

    function countChange(address _user) view public returns(uint256 amount) {
        return _countChange(
            Quarter.balanceOf(_user),
            Dime.balanceOf(_user),
            Nickel.balanceOf(_user),
            Penny.balanceOf(_user)
        );
    }

    function giveChange(uint256 _amount) external {
        uint256 leftOverAmount = _giveCoins(_amount, Quarter);
        leftOverAmount = _giveCoins(leftOverAmount, Dime);
        leftOverAmount = _giveCoins(leftOverAmount, Nickel);
        leftOverAmount = _giveCoins(leftOverAmount, Penny);
        USDC.transferFrom(msg.sender, address(this), _amount - leftOverAmount);
        balance += _amount - leftOverAmount;

        emit Change(msg.sender, _amount, _amount - leftOverAmount, leftOverAmount);
    }

    function giveQuarters(uint256 _amount) external {
        uint256 leftOverAmount = _giveCoins(_amount, Quarter);
        USDC.transferFrom(msg.sender, address(this), _amount - leftOverAmount);
        balance += _amount - leftOverAmount;

        emit Change(msg.sender, _amount, _amount - leftOverAmount, leftOverAmount);
    }

    function giveDimes(uint256 _amount) external {
        uint256 leftOverAmount = _giveCoins(_amount, Dime);
        USDC.transferFrom(msg.sender, address(this), _amount - leftOverAmount);
        balance += _amount - leftOverAmount;

        emit Change(msg.sender, _amount, _amount - leftOverAmount, leftOverAmount);
    }

    function giveNickels(uint256 _amount) external {
        uint256 leftOverAmount = _giveCoins(_amount, Nickel);
        USDC.transferFrom(msg.sender, address(this), _amount - leftOverAmount);
        balance += _amount - leftOverAmount;

        emit Change(msg.sender, _amount, _amount - leftOverAmount, leftOverAmount);
    }

    function givePennies(uint256 _amount) external {
        uint256 leftOverAmount = _giveCoins(_amount, Penny);
        USDC.transferFrom(msg.sender, address(this), _amount - leftOverAmount);
        balance += _amount - leftOverAmount;

        emit Change(msg.sender, _amount, _amount - leftOverAmount, leftOverAmount);
    }

    function cashOut(uint256 _quarters, uint256 _dimes, uint256 _nickels, uint256 _pennies) public {
        uint256 amount = _countChange(_quarters, _dimes, _nickels, _pennies);
        if(_quarters > 0) {
            Quarter.burn(msg.sender, _quarters);
        }
        if(_dimes > 0) {
            Dime.burn(msg.sender, _dimes);
        }
        if(_nickels > 0) {
            Nickel.burn(msg.sender, _nickels);
        }
        if(_pennies > 0) {
            Penny.burn(msg.sender, _pennies);
        }
        balance -= amount;
        USDC.transfer(msg.sender, amount);

        emit CashOut(msg.sender, amount);
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
        uint256 coinValue = _coin.value();
        if(_amount > coinValue) {
            _coin.mint(msg.sender, _amount / coinValue);
        }
        return _amount % coinValue;
    }

    function _countChange(uint256 _quarters, uint256 _dimes, uint256 _nickels, uint256 _pennies) internal view returns(uint256 amount) {
        if(_quarters > 0) {
            amount += _quarters * Quarter.value();
        }
        if(_dimes > 0) {
            amount += _dimes * Dime.value();
        }
        if(_nickels > 0) {
            amount += _nickels * Nickel.value();
        }
        if(_pennies > 0) {
            amount += _pennies * Penny.value();
        }
        return amount;
    }

}