// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./interfaces/IUniswap.sol";

import "hardhat/console.sol";


contract TestUniswapLiquidity {
    address private constant FACTORY =
        0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f;
    address private constant ROUTER =
        0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D;
    address private constant WETH = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;

    bytes32 constant PERMIT_TYPEHASH =
        keccak256(
            "Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)"
        );
    mapping(address => mapping(address => uint256)) public nonces;

    function addLiquidity(
        address _tokenA,
        address _tokenB,
        uint256 _amountA,
        uint256 _amountB
    ) external {
        IERC20(_tokenA).transferFrom(msg.sender, address(this), _amountA);
        IERC20(_tokenB).transferFrom(msg.sender, address(this), _amountB);

        IERC20(_tokenA).approve(ROUTER, _amountA);
        IERC20(_tokenB).approve(ROUTER, _amountB);

        (
            uint256 amountA,
            uint256 amountB,
            uint256 liquidity
        ) = IUniswapV2Router(ROUTER).addLiquidity(
                _tokenA,
                _tokenB,
                _amountA,
                _amountB,
                1,
                1,
                address(this),
                block.timestamp
            );

        console.log("Amount A:", amountA);
        console.log("Amount B:", amountB);
        console.log("LP Token Get By User:", liquidity);
    }

    function removeLiquidity(address _tokenA, address _tokenB) external {
        address pair = IUniswapV2Factory(FACTORY).getPair(_tokenA, _tokenB);

        uint256 liquidity = IERC20(pair).balanceOf(address(this));
        IERC20(pair).approve(ROUTER, liquidity);

        (uint256 amountA, uint256 amountB) = IUniswapV2Router(ROUTER)
            .removeLiquidity(
                _tokenA,
                _tokenB,
                liquidity,
                1,
                1,
                address(this),
                block.timestamp
            );
        console.log("Amount of Token A", amountA);
        console.log("Amount of Token B", amountB);
    }

    function removeLiquidityWithPermit(
        address _tokenA,
        address _tokenB,
        bool _approveMax,
        uint8 _v,
        bytes32 _r,
        bytes32 _s
    ) external {
        address pair = IUniswapV2Factory(FACTORY).getPair(_tokenA, _tokenB);
        uint256 liquidity = IERC20(pair).balanceOf(address(this));
        (uint256 amountA, uint256 amountB) = IUniswapV2Router(ROUTER)
            .removeLiquidityWithPermit(
                _tokenA,
                _tokenB,
                liquidity,
                1,
                1,
                address(this),
                block.timestamp,
                _approveMax,
                _v,
                _r,
                _s
            );
        console.log("Amount of Token A", amountA);
        console.log("Amount of Token B", amountB);
    }

    


}
