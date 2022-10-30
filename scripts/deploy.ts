import { ethers } from "hardhat";
import util from "../utils";

async function main() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);

    console.log("Account balance:", (await deployer.getBalance()).toString());

    if (ethers.provider.network.chainId == 80001) {
        //mumbai deploy script
        const mockUSDCFactory = await ethers.getContractFactory("MockUSDC");
        const mockUSDC = await mockUSDCFactory.deploy();
        console.log("MockUSDC address:", mockUSDC.address);
        const changeMachineFactory = await ethers.getContractFactory("ChangeMachine");
        const changeMachine = await changeMachineFactory.deploy(mockUSDC.address);
        console.log("ChangeMachine address:", changeMachine.address);
        console.log("Verify MockUSDC with: yarn hardhat verify --network mumbai " + mockUSDC.address);
        console.log("Verify ChangeMachine with: yarn hardhat verify --network mumbai " + changeMachine.address + " " + mockUSDC.address);
        console.log("Verify Coins with: yarn hardhat verify --network mumbai " + await changeMachine.Quarter() + " \"Quarter\" \"QUARTER\" 250000");
    }
    else if (ethers.provider.network.chainId == 137) {
        //polygon deploy script
        const changeMachineFactory = await ethers.getContractFactory("ChangeMachine");
        const changeMachine = await changeMachineFactory.deploy(util.POLYGON_USDC_ADDRESS);
        console.log("ChangeMachine address:", changeMachine.address);
        console.log("Verify ChangeMachine with: yarn hardhat verify --network polygon " + changeMachine.address + " " + util.POLYGON_USDC_ADDRESS);
        console.log("Verify Coins with: yarn hardhat verify --network polygon " + await changeMachine.Quarter() + " \"Quarter\" \"QUARTER\" 250000");
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });