import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("TokenSwap Contract Test\n", () => {
  async function deployTokenSwap() {
    const initialSupply = 1000000;
    const tokenPrice = ethers.parseEther("5");

    // Deploy CohortXToken contract
    const CohortXTokenContract = await ethers.getContractFactory(
      "CohortXToken"
    );
    const cohortXToken = await CohortXTokenContract.deploy(
      initialSupply,
      tokenPrice
    );
    await cohortXToken.waitForDeployment();

    // Deploy Web3Bridge contract
    const Web3BridgeTokenContract = await ethers.getContractFactory(
      "Web3BridgeToken"
    );
    const web3BridgeToken = await Web3BridgeTokenContract.deploy(
      initialSupply,
      tokenPrice
    );
    await web3BridgeToken.waitForDeployment();

    // Deploy TokenSwap contract
    const TokenSwapContract = await ethers.getContractFactory("TokenSwap");
    const tSwap = await TokenSwapContract.deploy(
      cohortXToken.target,
      web3BridgeToken.target
    );
    await tSwap.waitForDeployment();

    const [owner, addr1, addr2] = await ethers.getSigners();

    return { tSwap, owner, addr1, addr2, cohortXToken, web3BridgeToken };
  }

  describe("Setting exchange ratio test", async () => {
    it("should set ratio if it's the owner", async () => {
      const { tSwap, owner } = await loadFixture(deployTokenSwap);
      const ratio = 100;

      await tSwap.connect(owner).setRatio(ratio);

      expect(await tSwap.getRatio()).to.equal(ratio);
    });

    it("should revert if it's not the owner\n", async () => {
      const { tSwap, addr1 } = await loadFixture(deployTokenSwap);
      const ratio = 100;

      await expect(tSwap.connect(addr1).setRatio(ratio)).to.be.revertedWith(
        "Only admin can call this function"
      );
    });
  });

  describe("Setting fee test", async () => {
    it("should set fee if it's the owner", async () => {
      const { tSwap, owner } = await loadFixture(deployTokenSwap);
      const fees = 1;

      await tSwap.connect(owner).setFees(fees);
      expect(await tSwap.getFees()).to.equal(fees);
    });

    it("should revert if it's not the owner\n", async function () {
      const { tSwap, addr1 } = await loadFixture(deployTokenSwap);
      const fees = 1;

      await expect(tSwap.connect(addr1).setFees(fees)).to.be.revertedWith(
        "Only admin can call this function"
      );
    });
  });

  describe("Swap CohortXToken to Web3Bridge", function () {
    it("should revert if amount is zero", async function () {
      const { tSwap, addr1 } = await loadFixture(deployTokenSwap);
      await expect(tSwap.connect(addr1).swapFromCTX(0)).to.be.revertedWith(
        "Amount must be greater than zero"
      );
    });

    it("should revert if sender has insufficient balance", async function () {
      const { tSwap, addr1 } = await loadFixture(deployTokenSwap);
      await expect(
        tSwap.connect(addr1).swapFromCTX(ethers.parseEther("1"))
      ).to.be.revertedWith("Insufficient balance");
    });
  });
});
