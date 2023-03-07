//SPDX-License-Identifier:MIT
pragma solidity ^0.8.0;

import "./interfaces/Uniswap.sol";
import "hardhat/console.sol";

contract UniswapPair {
    IUniswapV2Pair public uniswapPair;

    function setReserve(address _add) external {
        uniswapPair = IUniswapV2Pair(_add);
    }

    function getReserves()
        external
        view
        returns (uint256 reserveIn, uint256 reserveOut)
    {
        (uint112 reserve0, uint112 reserve1, ) = uniswapPair.getReserves();
        address token0 = uniswapPair.token0();
        (reserveIn, reserveOut) = uniswapPair.token0() == address(token0)
            ? (reserve0, reserve1)
            : (reserve1, reserve0);
    }
}
