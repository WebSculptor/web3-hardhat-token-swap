import { ethers } from "hardhat";

async function main() {
  const initialSupply = 1000000;
  const tokenPrice = ethers.parseEther("5");

  // Deploy CohortXToken contract
  const CohortXTokenContract = await ethers.getContractFactory("CohortXToken");
  const cohortXToken = await CohortXTokenContract.deploy(
    initialSupply,
    tokenPrice
  );
  await cohortXToken.waitForDeployment();
  console.log("CohortXToken deployed to:", cohortXToken.target);

  // Deploy Web3Bridge contract
  const Web3BridgeTokenContract = await ethers.getContractFactory(
    "Web3BridgeToken"
  );
  const web3BridgeToken = await Web3BridgeTokenContract.deploy(
    initialSupply,
    tokenPrice
  );
  await web3BridgeToken.waitForDeployment();
  console.log("Web3Bridge deployed to:", web3BridgeToken.target);

  // Deploy TokenSwap contract
  const TokenSwapContract = await ethers.getContractFactory("TokenSwap");
  const tokenSwap = await TokenSwapContract.deploy(
    cohortXToken.target,
    web3BridgeToken.target
  );
  await tokenSwap.waitForDeployment();
  console.log("TokenSwap deployed to:", tokenSwap.target);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
