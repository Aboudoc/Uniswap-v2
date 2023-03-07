// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./IERC20.sol";
import "./IUniswapV2Router.sol";
import "./IUniswapV2Factory.sol";

contract UniswapV2MultiHopSwap {
    address private constant UNISWAP_V2_ROUTER =
        0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D;

    address private constant WETH = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;
    address private constant DAI = 0x6B175474E89094C44Da98b954EedeAC495271d0F;
    address private constant CRV = 0xD533a949740bb3306d119CC777fa900bA034cd52;

    IUniswapV2Router private constant router =
        IUniswapV2Router(UNISWAP_V2_ROUTER);
    IERC20 private constant weth = IERC20(WETH);
    IERC20 private constant dai = IERC20(DAI);
    IERC20 private constant crv = IERC20(CRV);

    function swapMultiHopExactAmountIn(uint amountIn, uint amountOutMin)
        external
    {
        dai.transferFrom(msg.sender, address(this), amountIn);
        dai.approve(UNISWAP_V2_ROUTER, amountIn);

        address[] memory path = new address[](3);
        path[0] = DAI;
        path[1] = WETH;
        path[2] = CRV;

        router.swapExactTokensForTokens(
            amountIn,
            amountOutMin,
            path,
            msg.sender,
            block.timestamp
        );
    }

    function swapMultiHopExactAmountOut(uint amountOutDesired, uint amountInMax)
        external
    {
        dai.transferFrom(msg.sender, address(this), amountInMax);
        dai.approve(UNISWAP_V2_ROUTER, amountInMax);

        address[] memory path = new address[](3);
        path[0] = DAI;
        path[1] = WETH;
        path[2] = CRV;

        uint[] memory amounts = router.swapTokensForExactTokens(
            amountOutDesired,
            amountInMax,
            path,
            msg.sender,
            block.timestamp
        );

        if (amounts[0] < amountInMax) {
            dai.transfer(msg.sender, amountInMax - amounts[0]);
        }
    }
}
