// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./IUniswapV2Factory.sol";
import "./IUniswapV2Router.sol";
import "./IERC20.sol";

contract UniswapV2Liquidity {
    event Log(string message, uint val);

    address private constant UNISWAP_V2_ROUTER =
        0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D;

    address private constant UNISWAP_V2_FACTORY =
        0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f;

    address private constant WETH = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;
    address private constant DAI = 0x6B175474E89094C44Da98b954EedeAC495271d0F;

    IUniswapV2Router private constant router =
        IUniswapV2Router(UNISWAP_V2_ROUTER);
    IUniswapV2Factory private constant factory =
        IUniswapV2Factory(UNISWAP_V2_FACTORY);

    IERC20 private constant weth = IERC20(WETH);
    IERC20 private constant dai = IERC20(DAI);

    IERC20 private immutable pair;

    constructor() {
        pair = IERC20(factory.getPair(WETH, DAI));
    }

    function addLiquidity(uint wethAmountDesired, uint daiAmountDesired)
        external
    {
        weth.transferFrom(msg.sender, address(this), wethAmountDesired);
        dai.transferFrom(msg.sender, address(this), daiAmountDesired);
        weth.approve(address(router), wethAmountDesired);
        dai.approve(address(router), daiAmountDesired);
        (uint wethAmount, uint daiAmount, uint liquidity) = router.addLiquidity(
            WETH,
            DAI,
            wethAmountDesired,
            daiAmountDesired,
            1,
            1,
            msg.sender,
            block.timestamp
        );
        // Trying to get liquidity amount returned from the function call to fix issues met when testing
        // emit Log("wethAmount", wethAmount);
        // emit Log("daiAmount", daiAmount);
        emit Log("liquidity", liquidity);

        if (wethAmount < wethAmountDesired) {
            weth.transfer(msg.sender, wethAmountDesired - wethAmount);
        }

        if (daiAmount < daiAmountDesired) {
            dai.transfer(msg.sender, daiAmountDesired - daiAmount);
        }
    }

    // Trying to get liquidity
    function removeLiquidity() external {
        uint liquidity = IERC20(pair).balanceOf(msg.sender);
        require(liquidity > 0, "liquidity = 0");
        pair.transferFrom(msg.sender, address(this), liquidity);
        pair.approve(address(router), liquidity);

        (uint wethAmount, uint daiAmount) = router.removeLiquidity(
            WETH,
            DAI,
            liquidity,
            1,
            1,
            msg.sender,
            block.timestamp
        );

        emit Log("wethAmount", wethAmount);
        emit Log("daiAmount", daiAmount);
    }

    // function removeLiquidity(uint liquidity) external {
    //     pair.transferFrom(msg.sender, address(this), liquidity);
    //     pair.approve(address(router), liquidity);

    //     router.removeLiquidity(
    //         WETH,
    //         DAI,
    //         liquidity,
    //         1,
    //         1,
    //         msg.sender,
    //         block.timestamp
    //     );
    // }
}
