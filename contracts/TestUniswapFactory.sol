//SPDX-License-Identifier:MIT
pragma solidity ^0.8;

import "./interfaces/Uniswap.sol";

contract TestUniswapFactory {
    address private constant UNISWAP_V2_FACTORY =
        0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f;

    function getReserveAdd(address _tokenA, address _tokenB)
        external
        view
        returns (address)
    {
        address _pairAddress = IUniswapV2Factory(UNISWAP_V2_FACTORY).getPair(
            _tokenA,
            _tokenB
        );
        return _pairAddress;
    }
}
