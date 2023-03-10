// const { BigNumber } = require("@ethersproject/bignumber");
const { assert, expect } = require("chai");
const { ethers } = require("hardhat");
const {
  WETH_WHALE,
  DAI_WHALE,
  WETHDAI_WHALE,
  WETH_WHALE1,
  WETH,
  DAI,
  CRV,
} = require("./config.js");

// Single Hop Swap ✅
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

    console.log(
      "-----------------------------SINGLE SWAP-----------------------------"
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

// Multi Hop Swap ✅
describe("Uniswap v2 Multi Hop Swap", function () {
  let TestMultiSwapContract;

  beforeEach(async () => {
    const TestMultiSwapFactory = await ethers.getContractFactory(
      "UniswapV2MultiHopSwap"
    );
    TestMultiSwapContract = await TestMultiSwapFactory.deploy();
    await TestMultiSwapContract.deployed();
  });

  it("should Multiswap", async () => {
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
      "------------------------------MULTI SWAP------------------------------"
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

// Add Liquidity ✅
describe("Uniswap V2 Liquidity", function () {
  let TestLiquidityContract;

  beforeEach(async () => {
    const TestLiquidityFactory = await ethers.getContractFactory(
      "UniswapV2Liquidity"
    );

    TestLiquidityContract = await TestLiquidityFactory.deploy();
    await TestLiquidityContract.deployed();
  });
  it("should add liquidity", async () => {
    await hre.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [WETHDAI_WHALE],
      // WETHDAI_WHALE holds WETH, DAI and ETH
    });
    const impersonateSigner = await ethers.getSigner(WETHDAI_WHALE);

    const WETHContract = await ethers.getContractAt("IERC20", WETH);
    const DAIContract = await ethers.getContractAt("IERC20", DAI);
    // const UNIContract = await ethers.getContractAt("IERC20", UNI);
    const DAIBalanceBefore = await DAIContract.balanceOf(
      impersonateSigner.address
    );
    const WETHBalanceBefore = await WETHContract.balanceOf(
      impersonateSigner.address
    );

    await DAIContract.connect(impersonateSigner).approve(
      TestLiquidityContract.address,
      DAIBalanceBefore
    );

    await WETHContract.connect(impersonateSigner).approve(
      TestLiquidityContract.address,
      WETHBalanceBefore
    );

    console.log(
      `WETH Balannce before adding liquidity: ${ethers.utils.formatUnits(
        WETHBalanceBefore.toString()
      )}`
    );
    console.log(
      `DAI Balance before adding liquidity: ${ethers.utils.formatUnits(
        DAIBalanceBefore.toString()
      )}`
    );

    console.log(
      "----------------------------ADD LIQUIDITY----------------------------"
    );

    let tx = await TestLiquidityContract.connect(
      impersonateSigner
    ).addLiquidity(WETHBalanceBefore, DAIBalanceBefore);

    let receipt = await tx.wait();
    // console.log(receipt.logs);
    // console.log(receipt.events[0].topics.toString());
    // console.log(receipt.events[0].args.message.toString());
    // console.log(receipt.events[0].args.val.toString());

    const WETHBalanceAfter = await WETHContract.balanceOf(
      impersonateSigner.address
    );
    const DAIBalanceAfter = await DAIContract.balanceOf(
      impersonateSigner.address
    );

    console.log(
      `WETH Balance after adding Liquidity: ${ethers.utils.formatUnits(
        WETHBalanceAfter.toString()
      )}`
    );

    console.log(
      `DAI Balance after adding Liquidity: ${ethers.utils.formatUnits(
        DAIBalanceAfter.toString()
      )}`
    );

    assert.isBelow(
      WETHBalanceAfter,
      WETHBalanceBefore,
      "WETH not added to liquidity"
    );
    assert.isBelow(
      DAIBalanceAfter,
      DAIBalanceBefore,
      "DAI not added to liquidity"
    );

    expect(tx).to.emit(TestLiquidityContract, "Log");
  });

  it("should remove liquidity", async () => {
    await hre.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [WETHDAI_WHALE],
      // WETHDAI_WHALE holds WETH, DAI and ETH
    });
    const impersonateSigner = await ethers.getSigner(WETHDAI_WHALE);

    const WETHContract = await ethers.getContractAt("IERC20", WETH);
    const DAIContract = await ethers.getContractAt("IERC20", DAI);
    const DAIBalanceBefore = await DAIContract.balanceOf(
      impersonateSigner.address
    );
    const WETHBalanceBefore = await WETHContract.balanceOf(
      impersonateSigner.address
    );
    console.log(
      `WETH Balance before removing Liquidity: ${ethers.utils.formatUnits(
        WETHBalanceBefore.toString()
      )}`
    );

    console.log(
      `DAI Balance before removing Liquidity: ${ethers.utils.formatUnits(
        DAIBalanceBefore.toString()
      )}`
    );

    //❌
    ////////////////////////////////////////////////////
    ////////////////Stuck at this point////////////////
    ////////////////////////////////////////////////////
    //can't find events emited on transaction receipt,
    // and also the transaction was reverted
    // (after calling remove liquidity)
    // with this error: 'ds-math-sub-underflow'
    ////////////////////////////////////////////////////
    ////////////////////////////////////////////////////

    console.log(
      "----------------------------REMOVE LIQUIDITY----------------------------"
    );

    // let tx = await TestLiquidityContract.connect(
    //   impersonateSigner
    // ).removeLiquidity();

    // let receipt = await tx.wait(1);

    // console.log(receipt);

    // const WETHBalanceAfter = await WETHContract.balanceOf(
    //   impersonateSigner.address
    // );
    // const DAIBalanceAfter = await DAIContract.balanceOf(
    //   impersonateSigner.address
    // );

    // console.log(
    //   `WETH Balance after removing Liquidity: ${ethers.utils.formatUnits(
    //     WETHBalanceAfter.toString()
    //   )}`
    // );

    // console.log(
    //   `DAI Balance after removing Liquidity: ${ethers.utils.formatUnits(
    //     DAIBalanceAfter.toString()
    //   )}`
    // );
  });
});

// Flash Swap ✅
describe("Uniswap V2 Flash Swap", function () {
  let TestFlashContract;

  beforeEach(async () => {
    const TestFlashFactory = await ethers.getContractFactory(
      "UniswapV2FlashSwap"
    );

    TestFlashContract = await TestFlashFactory.deploy();
    await TestFlashContract.deployed();
  });
  it("flash swap", async () => {
    await hre.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [WETH_WHALE1],
      // WETHDAI_WHALE holds WETH, DAI and ETH
    });

    const impersonateSigner = await ethers.getSigner(WETH_WHALE1);

    const WETHContract = await ethers.getContractAt("IERC20", WETH);

    const WETHBalanceBefore = await WETHContract.balanceOf(
      impersonateSigner.address
    );

    console.log(
      `Balance of WETH before the Flash Swap: ${ethers.utils.formatUnits(
        WETHBalanceBefore.toString()
      )}`
    );

    await WETHContract.connect(impersonateSigner).approve(
      TestFlashContract.address,
      WETHBalanceBefore
    );

    console.log(
      "----------------------------FLASH SWAP----------------------------"
    );
    const amountFlash = ethers.utils.parseUnits("100");
    await TestFlashContract.connect(impersonateSigner).flashSwap(amountFlash);

    const WETHBalanceAfter = await WETHContract.balanceOf(
      impersonateSigner.address
    );

    console.log(
      `Balance of WETH AFTER the Flash Swap: ${ethers.utils.formatUnits(
        WETHBalanceAfter.toString()
      )}`
    );
    assert(WETHBalanceAfter < WETHBalanceBefore);
  });
});
