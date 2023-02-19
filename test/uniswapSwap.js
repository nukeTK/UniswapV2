const { assert, expect } = require("chai");
const { BigNumber } = require("ethers");
const { ethers } = require("hardhat");

describe("Testing Uniswap V2 Swap", ()=>{
    let WETH, DAI,weth, dai,account, TestSwap, TestSwapDeploy;

    before(async()=>{
        WETH = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";
        DAI = "0x6b175474e89094c44da98b954eedeac495271d0f";
        weth = await ethers.getContractAt("IWETH", WETH);
        account = await ethers.getSigner();
        dai  = await ethers.getContractAt("IERC20", DAI);
        TestSwap = await ethers.getContractFactory("TestUniswapSwap");
        TestSwapDeploy = await TestSwap.deploy();
        TestSwapDeploy.deployed();
    });
    it("Testing transfer token function",async()=>{
        const amountIn = 1n **18n;
        await weth.connect(account).deposit({value:amountIn});
        await weth.connect(account).approve(TestSwapDeploy.address, amountIn);
        expect(await weth.balanceOf(account.address)).to.equals((1n**18n));
    });
    it("Checking the getAmountOutMin function",async()=>{
        const amountIn = 1n ** 18n;
        await weth.connect(account).deposit({value:amountIn});
        await weth.connect(account).approve(TestSwapDeploy.address, amountIn);
        const amountOutMin = await TestSwapDeploy.getAmountOutmin(WETH, DAI, amountIn);
        console.log(amountOutMin);

    })
    it("Swap Token checking the balance again", async()=>{
        const amountIn = 1n ** 18n;
        await weth.connect(account).deposit({value:amountIn});
        await weth.connect(account).approve(TestSwapDeploy.address, amountIn);
        const amountOutMin = await TestSwapDeploy.getAmountOutmin(WETH, DAI, amountIn);
        const daiAmountInAccount = await dai.balanceOf(account.address);
        await TestSwapDeploy.swap(WETH,DAI,amountIn, amountOutMin,account.address);
        expect(await dai.balanceOf(account.address)).to.equals(BigInt(amountOutMin)+BigInt(daiAmountInAccount));
    })
})