// const { BigNumber } = require("@ethersproject/bignumber");
const { assert } = require("chai");
const { ethers } = require("hardhat");
const { WETH_WHALE, WETH, DAI } = require("./config.js");

describe("Uniswap v2 Single Hop Swap", function () {
  let TestSwapContract;

  beforeEach(async () => {
    const TestSwapFactory = await ethers.getContractFactory(
      "UniswapV2SingleHopSwap"
    );
    TestSwapContract = await TestSwapFactory.deploy();
    await TestSwapContract.deployed();
  });

  it("should swap", async () => {
    await hre.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [WETH_WHALE],
    });
    const impersonateSigner = await ethers.getSigner(WETH_WHALE);

    const WETHContract = await ethers.getContractAt("IERC20", WETH);

    const WETHHolderBalance = await WETHContract.balanceOf(
      impersonateSigner.address
    );
    await WETHContract.connect(impersonateSigner).approve(
      TestSwapContract.address,
      WETHHolderBalance
    );

    const DAIContract = await ethers.getContractAt("IERC20", DAI);

    const DAIHolderBalance = await DAIContract.balanceOf(
      impersonateSigner.address
    );
    console.log(
      "Initial DAI Balance:",
      ethers.utils.formatUnits(DAIHolderBalance.toString())
    );

    console.log(
      "Initial WETH Balance:",
      ethers.utils.formatUnits(WETHHolderBalance.toString())
    );

    await TestSwapContract.connect(
      impersonateSigner
    ).swapSingleHopExactAmountIn(WETHHolderBalance, 1);

    const daiBalance_updated = await DAIContract.balanceOf(
      impersonateSigner.address
    );
    console.log(
      "DAI Balance after Swap:",
      ethers.utils.formatUnits(daiBalance_updated.toString())
    );
    const WETHHolderBalance_updated = await WETHContract.balanceOf(
      impersonateSigner.address
    );
    // expect(WETHHolderBalance_updated.eq(BigNumber.from(0))).to.be.true;
    // expect(DAIBalance_updated.gt(DAIHolderBalance)).to.be.true;
    assert.equal(WETHHolderBalance_updated.toString(), 0);
  });
});
