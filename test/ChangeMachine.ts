import { ethers } from "hardhat";
import { expect } from "chai";
import { Contract } from "ethers";
import util from "../utils";

describe("Change Machine", () => {
  const ZERO = "0x0000000000000000000000000000000000000000";
  let changeMachine: Contract;
  let mockUSDC: Contract;
  let quarter: Contract;
  let dime: Contract;
  let nickel: Contract;
  let penny: Contract;
  let user: { address: any; };

  before(async function () {
    [user] = await ethers.getSigners();
    const mockUSDCFactory = await ethers.getContractFactory("MockUSDC");
    mockUSDC = await mockUSDCFactory.deploy();
    const changeMachineFactory = await ethers.getContractFactory("ChangeMachine");
    changeMachine = await changeMachineFactory.deploy(mockUSDC.address);
    quarter = new Contract(await changeMachine.Quarter(), util.COIN_ABI, user as any);
    dime = new Contract(await changeMachine.Dime(), util.COIN_ABI, user as any);
    nickel = new Contract(await changeMachine.Nickel(), util.COIN_ABI, user as any);
    penny = new Contract(await changeMachine.Penny(), util.COIN_ABI, user as any);
  });

  it("balance should return 0 when first deployed", async function () {
    expect(await changeMachine.balance()).to.equal(0);
  });
  //TODO: finish tests
  it("countChange should return 0 if the user has no change", async function () {
    expect(await changeMachine.countChange(user.address)).to.equal(0);
  });

  it("giveChange should give the correct change", async function () {
    await mockUSDC.approve(changeMachine.address, 900000000);

    expect(await changeMachine.giveChange(1171000))
      .to.emit(changeMachine, "Change")
      .withArgs(user.address, 1171000, 1170000, 1000);
    expect(await quarter.balanceOf(user.address)).to.equal(4);
    expect(await dime.balanceOf(user.address)).to.equal(1);
    expect(await nickel.balanceOf(user.address)).to.equal(1);
    expect(await penny.balanceOf(user.address)).to.equal(2);
    expect(await mockUSDC.balanceOf(user.address)).to.equal(8830000);
    expect(await mockUSDC.balanceOf(changeMachine.address)).to.equal(1170000);
  });

  it("giveQuarters should give the correct change in quarters", async function () {
    expect(await changeMachine.giveQuarters(530000))
      .to.emit(changeMachine, "Change")
      .withArgs(user.address, 530000, 500000, 30000);
    expect(await quarter.balanceOf(user.address)).to.equal(6);
    expect(await dime.balanceOf(user.address)).to.equal(1);
    expect(await nickel.balanceOf(user.address)).to.equal(1);
    expect(await penny.balanceOf(user.address)).to.equal(2);
    expect(await mockUSDC.balanceOf(user.address)).to.equal(8330000);
    expect(await mockUSDC.balanceOf(changeMachine.address)).to.equal(1670000);
  });

  it("giveDimes should give the correct change in dimes", async function () {
    expect(await changeMachine.giveDimes(110000))
      .to.emit(changeMachine, "Change")
      .withArgs(user.address, 110000, 100000, 10000);
    expect(await quarter.balanceOf(user.address)).to.equal(6);
    expect(await dime.balanceOf(user.address)).to.equal(2);
    expect(await nickel.balanceOf(user.address)).to.equal(1);
    expect(await penny.balanceOf(user.address)).to.equal(2);
    expect(await mockUSDC.balanceOf(user.address)).to.equal(8230000);
    expect(await mockUSDC.balanceOf(changeMachine.address)).to.equal(1770000);
    
  });

  it("giveNickels should give the correct change in nickels", async function () {
    expect(await changeMachine.giveNickels(100000))
      .to.emit(changeMachine, "Change")
      .withArgs(user.address, 100000, 100000, 0);
    expect(await quarter.balanceOf(user.address)).to.equal(6);
    expect(await dime.balanceOf(user.address)).to.equal(2);
    expect(await nickel.balanceOf(user.address)).to.equal(3);
    expect(await penny.balanceOf(user.address)).to.equal(2);
    expect(await mockUSDC.balanceOf(user.address)).to.equal(8130000);
    expect(await mockUSDC.balanceOf(changeMachine.address)).to.equal(1870000);
  });

  it("givePennies should give the correct change in pennies", async function () {
    expect(await changeMachine.givePennies(47000))
      .to.emit(changeMachine, "Change")
      .withArgs(user.address, 47000, 40000, 7000);
    expect(await quarter.balanceOf(user.address)).to.equal(6);
    expect(await dime.balanceOf(user.address)).to.equal(2);
    expect(await nickel.balanceOf(user.address)).to.equal(3);
    expect(await penny.balanceOf(user.address)).to.equal(6);
    expect(await mockUSDC.balanceOf(user.address)).to.equal(8090000);
    expect(await mockUSDC.balanceOf(changeMachine.address)).to.equal(1910000);
  });

  it("countChange should return the correct amount of USDC for the change", async function () {
    expect(await changeMachine.countChange(user.address)).to.equal(1910000);
  });

  it("cashOut should return the correct amount of USDC for the selected Quarters of the user", async function () {
    await quarter.approve(changeMachine.address, 900000000);

    expect(await changeMachine.cashOut(3,0,0,0))
      .to.emit(changeMachine, "CashOut")
      .withArgs(user.address, 750000);
    expect(await quarter.balanceOf(user.address)).to.equal(3);
    expect(await dime.balanceOf(user.address)).to.equal(2);
    expect(await nickel.balanceOf(user.address)).to.equal(3);
    expect(await penny.balanceOf(user.address)).to.equal(6);
    expect(await mockUSDC.balanceOf(user.address)).to.equal(8840000);
    expect(await mockUSDC.balanceOf(changeMachine.address)).to.equal(1160000);
  });

  it("cashOut should return the correct amount of USDC for the selected Dimes of the user", async function () {
    await dime.approve(changeMachine.address, 900000000);

    expect(await changeMachine.cashOut(0,1,0,0))
      .to.emit(changeMachine, "CashOut")
      .withArgs(user.address, 100000);
    expect(await quarter.balanceOf(user.address)).to.equal(3);
    expect(await dime.balanceOf(user.address)).to.equal(1);
    expect(await nickel.balanceOf(user.address)).to.equal(3);
    expect(await penny.balanceOf(user.address)).to.equal(6);
    expect(await mockUSDC.balanceOf(user.address)).to.equal(8940000);
    expect(await mockUSDC.balanceOf(changeMachine.address)).to.equal(1060000);
  });

  it("cashOut should return the correct amount of USDC for the selected Nickels of the user", async function () {
    await nickel.approve(changeMachine.address, 900000000);

    expect(await changeMachine.cashOut(0,0,1,0))
      .to.emit(changeMachine, "CashOut")
      .withArgs(user.address, 50000);
    expect(await quarter.balanceOf(user.address)).to.equal(3);
    expect(await dime.balanceOf(user.address)).to.equal(1);
    expect(await nickel.balanceOf(user.address)).to.equal(2);
    expect(await penny.balanceOf(user.address)).to.equal(6);
    expect(await mockUSDC.balanceOf(user.address)).to.equal(8990000);
    expect(await mockUSDC.balanceOf(changeMachine.address)).to.equal(1010000);
  });

  it("cashOut should return the correct amount of USDC for the selected Pennies of the user", async function () {
    await penny.approve(changeMachine.address, 900000000);

    expect(await changeMachine.cashOut(0,0,0,2))
      .to.emit(changeMachine, "CashOut")
      .withArgs(user.address, 50000);
    expect(await quarter.balanceOf(user.address)).to.equal(3);
    expect(await dime.balanceOf(user.address)).to.equal(1);
    expect(await nickel.balanceOf(user.address)).to.equal(2);
    expect(await penny.balanceOf(user.address)).to.equal(4);
    expect(await mockUSDC.balanceOf(user.address)).to.equal(9010000);
    expect(await mockUSDC.balanceOf(changeMachine.address)).to.equal(990000);
  });

  it("cashOut should return the correct amount of USDC for the selected change of the user", async function () {
    expect(await changeMachine.cashOut(1,1,1,2))
      .to.emit(changeMachine, "CashOut")
      .withArgs(user.address, 420000);
    expect(await quarter.balanceOf(user.address)).to.equal(2);
    expect(await dime.balanceOf(user.address)).to.equal(0);
    expect(await nickel.balanceOf(user.address)).to.equal(1);
    expect(await penny.balanceOf(user.address)).to.equal(2);
    expect(await mockUSDC.balanceOf(user.address)).to.equal(9430000);
    expect(await mockUSDC.balanceOf(changeMachine.address)).to.equal(570000);
  });

  it("cashOutAll should return the correct amount of USDC for all the change of the user", async function () {
    expect(await changeMachine.cashOutAll())
      .to.emit(changeMachine, "CashOut")
      .withArgs(user.address, 570000);
    expect(await quarter.balanceOf(user.address)).to.equal(0);
    expect(await dime.balanceOf(user.address)).to.equal(0);
    expect(await nickel.balanceOf(user.address)).to.equal(0);
    expect(await penny.balanceOf(user.address)).to.equal(0);
    expect(await mockUSDC.balanceOf(user.address)).to.equal(10000000);
    expect(await mockUSDC.balanceOf(changeMachine.address)).to.equal(0);
  });

  it("giveChange should revert if the user does not have enough USDC", async function () {
    await expect(changeMachine.giveChange(11000000)).to.be.revertedWith("Not enough USDC");
  });

  it("giveQuarters should revert if the user does not have enough USDC", async function () {
    await expect(changeMachine.giveQuarters(11000000)).to.be.revertedWith("Not enough USDC");
  });

  it("giveDimes should revert if the user does not have enough USDC", async function () {
    await expect(changeMachine.giveDimes(11000000)).to.be.revertedWith("Not enough USDC");
  });

  it("giveNickels should revert if the user does not have enough USDC", async function () {
    await expect(changeMachine.giveNickels(11000000)).to.be.revertedWith("Not enough USDC");
  });

  it("givePennies should revert if the user does not have enough USDC", async function () {
    await expect(changeMachine.givePennies(11000000)).to.be.revertedWith("Not enough USDC");
  });

  it("cashOut should revert if the user has no quarters", async function () {
    await expect(changeMachine.cashOut(1,0,0,0)).to.be.revertedWith("Not enough quarters");
  });

  it("cashOut should revert if the user has no dimes", async function () {
    await expect(changeMachine.cashOut(0,1,0,0)).to.be.revertedWith("Not enough dimes");
  });

  it("cashOut should revert if the user has no nickels", async function () {
    await expect(changeMachine.cashOut(0,0,1,0)).to.be.revertedWith("Not enough nickels");
  });

  it("cashOut should revert if the user has no pennies", async function () {
    await expect(changeMachine.cashOut(0,0,0,1)).to.be.revertedWith("Not enough pennies");
  });

});