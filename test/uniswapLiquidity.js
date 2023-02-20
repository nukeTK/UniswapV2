const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Testing Liquidity", () => {
  let WETH, DAI, daiToken, wethToken, liquidity, liquidityDeploy, signer;

  before("Operations", async () => {
    //Token Addresses
    WETH = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";
    DAI = "0x6b175474e89094c44da98b954eedeac495271d0f";
    //Getting contract with Address
    wethToken = await ethers.getContractAt("IWETH", WETH);
    daiToken = await ethers.getContractAt("IERC20", DAI);
    //Signer
    signer = await ethers.getSigner();
    //Contract Deployment
    liquidity = await ethers.getContractFactory("TestUniswapLiquidity");
    liquidityDeploy = await liquidity.deploy();
    await liquidityDeploy.deployed();
  });
  it("Add & Remove liquidity into the pool, Using WETH & DAI Tokens", async () => {
    //Checking the balance of DAI token
    const tokenBal = await daiToken.balanceOf(signer.address);
    //checking token must be greater than Random Amount
    expect(Number(tokenBal)).to.greaterThan(Number(1000));
    const amount = 10n ** 18n;
    //checking token must be greater than Amount
    await wethToken.deposit({ value: amount });
    //checking the balance of WETH token
    const wethBal = await wethToken.balanceOf(signer.address);
    expect(wethBal).to.equals(amount);

    //Approve the tokens so that liquidity contract used on behalf of signer
    daiToken.connect(signer).approve(liquidityDeploy.address, amount);
    wethToken.connect(signer).approve(liquidityDeploy.address, amount);
    console.log("----------------Add Liquidity-----------------")
    //Add Liquidity
    await liquidityDeploy
      .connect(signer)
      .addLiquidity(DAI, WETH, tokenBal, amount);
    console.log("----------------Remove Liquidity-----------------")
    //Remove Liquidity
    await liquidityDeploy.connect(signer).removeLiquidity(DAI, WETH);
  });
});
