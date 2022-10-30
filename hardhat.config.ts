require("dotenv").config();
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-contract-sizer";
import "@nomiclabs/hardhat-etherscan";
/** @type import('hardhat/config').HardhatUserConfig */


module.exports = {
  solidity: "0.8.17",
  networks: {
    mumbai: {
      url: process.env.POLYGON_RPC,
      accounts: [process.env.DEPLOYER_PRIVATE_KEY]
    },
    polygon: {
      url: process.env.MUMBAI_RPC,
      accounts: [process.env.DEPLOYER_PRIVATE_KEY]
    }
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_KEY
  }
};
