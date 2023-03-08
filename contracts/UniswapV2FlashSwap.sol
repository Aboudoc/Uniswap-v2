// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./IERC20.sol";
import "./IUniswapV2Factory.sol";
import "./IUniswapV2Callee.sol";
import "./IUniswapV2Pair.sol";

contract UniswapV2FlashSwap is IUniswapV2Callee {
    address private constant WETH = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;
    address private constant DAI = 0x6B175474E89094C44Da98b954EedeAC495271d0F;

    address private constant UNISWAP_V2_FACTORY =
        0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f;

    IERC20 private constant weth = IERC20(WETH);
    IUniswapV2Factory private constant factory =
        IUniswapV2Factory(UNISWAP_V2_FACTORY);
    IUniswapV2Pair private immutable pair;

    constructor() {
        pair = IUniswapV2Pair(factory.getPair(DAI, WETH));
    }

    function flashSwap(uint wethAmount) external {
        bytes memory data = abi.encode(WETH, msg.sender);
        pair.swap(0, wethAmount, address(this), data);
    }

    function uniswapV2Call(
        address sender,
        uint amount0,
        uint amount1,
        bytes calldata data
    ) external {
        require(msg.sender == address(pair), "not pair");
        require(sender == address(this), "not sender");

        (address tokenBorrow, address caller) = abi.decode(
            data,
            (address, address)
        );

        require(tokenBorrow == WETH, "not weth");

        uint fee = ((amount1 * 3) / 997) + 1;
        weth.transferFrom(caller, address(this), amount1 + fee);
        weth.transfer(address(pair), amount1 + fee);
    }
}
