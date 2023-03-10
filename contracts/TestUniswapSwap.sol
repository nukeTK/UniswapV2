//SPDX-License-Identifier:MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./interfaces/IUniswap.sol";

contract TestUniswapSwap {
    address private constant UNISWAP_V2_ROUTER =
        0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D;
    address private constant WETH = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;

    receive() external payable {}

    function swapExactTokensForTokens(
        address _tokenIn,
        address _tokenOut,
        uint256 _amountIn,
        uint256 _amountOutMin,
        address _to
    ) external {
        IERC20(_tokenIn).transferFrom(msg.sender, address(this), _amountIn);
        IERC20(_tokenIn).approve(UNISWAP_V2_ROUTER, _amountIn);

        address[] memory path;

        if (WETH == _tokenIn || WETH == _tokenOut) {
            path = new address[](2);
            path[0] = _tokenIn;
            path[1] = _tokenOut;
        } else {
            path = new address[](3);
            path[0] = _tokenIn;
            path[1] = WETH;
            path[2] = _tokenOut;
        }
        IUniswapV2Router(UNISWAP_V2_ROUTER).swapExactTokensForTokens(
            _amountIn,
            _amountOutMin,
            path,
            _to,
            block.timestamp
        );
    }

    function swapTokensForExactTokens(
        address _tokenIn,
        address _tokenOut,
        uint256 _amountOut,
        uint256 _amountInMax,
        address _to
    ) external {
        IERC20(_tokenIn).transferFrom(msg.sender, address(this), _amountOut);
        IERC20(_tokenIn).approve(UNISWAP_V2_ROUTER, _amountOut);

        address[] memory path;

        if (WETH == _tokenIn || WETH == _tokenOut) {
            path = new address[](2);
            path[0] = _tokenIn;
            path[1] = _tokenOut;
        } else {
            path = new address[](3);
            path[0] = _tokenIn;
            path[1] = WETH;
            path[2] = _tokenOut;
        }
        IUniswapV2Router(UNISWAP_V2_ROUTER).swapTokensForExactTokens(
            _amountOut,
            _amountInMax,
            path,
            _to,
            block.timestamp
        );
    }

    // **** LIBRARY FUNCTIONS ****

    //Maximum output token(without fee)
    function getAmountOutMin(
        address _tokenIn,
        address _tokenOut,
        uint256 _amountIn
    ) external view returns (uint256) {
        address[] memory path;

        if (WETH == _tokenIn || WETH == _tokenOut) {
            path = new address[](2);
            path[0] = _tokenIn;
            path[1] = _tokenOut;
        } else {
            path = new address[](3);
            path[0] = _tokenIn;
            path[1] = WETH;
            path[2] = _tokenOut;
        }

        //same length as path
        uint256[] memory amountOutMins = IUniswapV2Router(UNISWAP_V2_ROUTER)
            .getAmountsOut(_amountIn, path);
        return amountOutMins[path.length - 1];
    }

    //Minimum input token(without fee)
    function getAmountInMax(
        address _tokenIn,
        address _tokenOut,
        uint256 _amountOut
    ) external view returns (uint256) {
        address[] memory path;

        if (WETH == _tokenIn || WETH == _tokenOut) {
            path = new address[](2);
            path[0] = _tokenOut;
            path[1] = _tokenIn;
        } else {
            path = new address[](3);
            path[0] = _tokenOut;
            path[1] = WETH;
            path[2] = _tokenIn;
        }

        //same length as path
        uint256[] memory amountInMax = IUniswapV2Router(UNISWAP_V2_ROUTER)
            .getAmountsIn(_amountOut, path);
        return amountInMax[path.length - 1];
    }

    //Maximum Ouput, including reserve fees
    function getAmountOutMinF(
        uint _amountIn,
        uint _reserveIn,
        uint _reserveOut
    ) external pure returns (uint256) {
        return
            IUniswapV2Router(UNISWAP_V2_ROUTER).getAmountOut(
                _amountIn,
                _reserveIn,
                _reserveOut
            );
    }

    //Minimum Input Token including reserve fees
    function getAmountInMaxF(
        uint _amountOut,
        uint _reserveIn,
        uint _reserveOut
    ) external pure returns (uint256) {
        return
            IUniswapV2Router(UNISWAP_V2_ROUTER).getAmountIn(
                _amountOut,
                _reserveIn,
                _reserveOut
            );
    }
}
