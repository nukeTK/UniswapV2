const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Testing uniswap flash Swap", () => {

  let DAI,daiToken, flashSwap, flashSwapDeploy, account;
  
  before("Getting Values", async () => {
    DAI = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
    daiToken = await ethers.getContractAt("IERC20", DAI);
        
    flashSwap = await ethers.getContractFactory("TestUniswapFlashSwap");
    flashSwapDeploy = await flashSwap.deploy();
    flashSwapDeploy.deployed();
  
});
  it("Testing Flash Swap", async () => {
      
    const amount = 10n ** 6n;
    //Fund the contract
    //so it will repay the full amount with transaction fee
    await daiToken.transfer(flashSwapDeploy.address,amount);
    //checking the balance 
    console.log(await daiToken.balanceOf(flashSwapDeploy.address));
    //Implementing the flash swap function
    await flashSwapDeploy.connect(account).testFlashSwap(DAI,amount);
  });
});
