import { ethers } from "hardhat";
import { expect } from "chai";
import { Contract } from "ethers";

describe("Change Machine", () => {
  const ZERO = "0x0000000000000000000000000000000000000000";
  let changeMachine: Contract;
  let mockUSDC: Contract;
  let user;

  before(async function () {
    [user] = await ethers.getSigners();
    const mockUSDCFactory = await ethers.getContractFactory("MockUSDC");
    mockUSDC = await mockUSDCFactory.deploy();
    const changeMachineFactory = await ethers.getContractFactory("ChangeMachine");
    changeMachine = await changeMachineFactory.deploy(mockUSDC.address);
  });

  it("balance should return 0 when first deployed", async function () {
    expect(await changeMachine.balance()).to.equal(0);
  });
  //TODO: finish tests
  it("countChange should return 0 if the user has no change", async function () {
    
  });

  it("giveChange should give the correct change", async function () {
    
  });

  it("giveQuarters should give the correct change in quarters", async function () {
    
  });

  it("giveDimes should give the correct change in dimes", async function () {
    
  });

  it("giveNickels should give the correct change in nickels", async function () {
    
  });

  it("givePennies should give the correct change in pennies", async function () {
    
  });

  it("countChange should return the correct amount of for the change", async function () {
    
  });

  it("cashOut should return the correct amount of USDC for the selected change of the user", async function () {
    
  });

  it("cashOutAll should return the correct amount of USDC for all the change of the user", async function () {
    
  });

});