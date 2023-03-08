// const { BigNumber } = require("@ethersproject/bignumber");
const { assert } = require("chai");
const { ethers } = require("hardhat");
const { WETH_WHALE, DAI_WHALE, WETH, DAI, CRV } = require("./config.js");

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
    //✅
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

    console.log(
      "-----------------------------SWAP-----------------------------"
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
    console.log(
      `WETH Balance after Swap: ${ethers.utils.formatUnits(
        WETHHolderBalance_updated.toString()
      )}`
    );

    assert.equal(WETHHolderBalance_updated.toString(), 0);
  });
});

describe("Uniswap v2 Multi Hop Swap", function () {
  let TestMultiSwapContract;

  beforeEach(async () => {
    const TestMultiSwapFactory = await ethers.getContractFactory(
      "UniswapV2MultiHopSwap"
    );
    TestMultiSwapContract = await TestMultiSwapFactory.deploy();
    await TestMultiSwapContract.deployed();
  });

  // change to DAI WHALE because we swap DAI to WETH to CRV
  it("should Multiswap", async () => {
    //✅
    await hre.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [DAI_WHALE],
    });
    const impersonateSigner = await ethers.getSigner(DAI_WHALE);

    const DAIContract = await ethers.getContractAt("IERC20", DAI);

    const DAIHolderBalance = await DAIContract.balanceOf(
      impersonateSigner.address
    );

    await DAIContract.connect(impersonateSigner).approve(
      TestMultiSwapContract.address,
      DAIHolderBalance
    );

    const CRVContract = await ethers.getContractAt("IERC20", CRV);

    const CRVHolderBalance = await CRVContract.balanceOf(
      impersonateSigner.address
    );

    console.log(
      "Initial CRV Balance:",
      ethers.utils.formatUnits(CRVHolderBalance.toString())
    );

    console.log(
      "Initial DAI Balance:",
      ethers.utils.formatUnits(DAIHolderBalance.toString())
    );

    console.log(
      "-----------------------------SWAP-----------------------------"
    );

    await TestMultiSwapContract.connect(
      impersonateSigner
    ).swapMultiHopExactAmountIn(DAIHolderBalance, 1);

    const crvBalance_updated = await CRVContract.balanceOf(
      impersonateSigner.address
    );
    console.log(
      "CRV Balance after Swap:",
      ethers.utils.formatUnits(crvBalance_updated.toString())
    );
    const DAIHolderBalance_updated = await DAIContract.balanceOf(
      impersonateSigner.address
    );

    console.log(
      "DAI Balance after Swap:",
      ethers.utils.formatUnits(DAIHolderBalance_updated.toString())
    );

    assert.equal(DAIHolderBalance_updated.toString(), 0);
  });
});
