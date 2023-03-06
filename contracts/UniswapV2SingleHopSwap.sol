// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./IERC20.sol";
import "./IUniswapV2Router.sol";

contract UniswapV2SingleHopSwap {
    address private constant UNISWAP_V2_ROUTER =
        0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D;

    address private constant WETH = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;
    address private constant DAI = 0x6B175474E89094C44Da98b954EedeAC495271d0F;

    IUniswapV2Router private constant router =
        IUniswapV2Router(UNISWAP_V2_ROUTER);
    IERC20 private constant weth = IERC20(WETH);
    IERC20 private constant dai = IERC20(DAI);

    function swapSingleHopExactAmountIn(uint amountIn, uint amountOutMin)
        external
    {
        weth.transferFrom(msg.sender, address(this), amountIn);
        weth.approve(UNISWAP_V2_ROUTER, amountIn);
        address[] memory path = new address[](2);
        path[0] = WETH;
        path[1] = DAI;
        router.swapExactTokensForTokens(
            amountIn,
            amountOutMin,
            path,
            msg.sender,
            block.timestamp
        );
    }

    function swapSingleHopExactAmountOut(
        uint amountOutDesired,
        uint amountInMax
    ) external {
        weth.transferFrom(msg.sender, address(this), amountInMax);
        weth.approve(UNISWAP_V2_ROUTER, amountInMax);
        address[] memory path = new address[](2);
        path[0] = WETH;
        path[1] = DAI;
        router.swapTokensForExactTokens(
            amountOutDesired,
            amountInMax,
            path,
            msg.sender,
            block.timestamp
        );
        weth.transfer(msg.sender, weth.balanceOf(address(this)));
    }
}
