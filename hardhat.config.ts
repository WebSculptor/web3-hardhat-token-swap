import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";

dotenv.config();

const { ALCHEMY_API_HTTP, METAMASK_PRIVATE_KEY } = process.env;

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  networks: {
    sepolia: {
      url: ALCHEMY_API_HTTP,
      accounts: [METAMASK_PRIVATE_KEY as string],
    },
  },
};

export default config;
