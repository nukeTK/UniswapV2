const { expect } = require("chai");
const { ethers } = require("hardhat");
const keccak256 = require("keccak256");

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
    console.log("----------------Add Liquidity-----------------");
    //Add Liquidity
    await liquidityDeploy
      .connect(signer)
      .addLiquidity(DAI, WETH, tokenBal, amount);
    console.log("----------------Remove Liquidity-----------------");
    //Remove Liquidity
    await liquidityDeploy.connect(signer).removeLiquidity(DAI, WETH);
  });
  
  it("remove liquidity through function removeLiquidityWithPermit", async () => {
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
    console.log("----------------Add Liquidity-----------------");
    //Add Liquidity
    await liquidityDeploy
      .connect(signer)
      .addLiquidity(DAI, WETH, tokenBal, amount);

    const value = "1000000000000000000"; // the amount of tokens being granted (in wei)
    const nonce = 1; // the nonce value (should be incremented for each new permission)
    const deadline = Math.floor(Date.now() / 1000) + 3600;

    const domainSeparator = keccak256(
      ethers.utils.defaultAbiCoder.encode(
        ["bytes32", "bytes32", "bytes32", "uint256", "address"],
        [
          keccak256(
            ethers.utils.toUtf8Bytes(
              "EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"
            )
          ),
          keccak256(ethers.utils.toUtf8Bytes("Uniswap V2")),
          keccak256(ethers.utils.toUtf8Bytes("1")),
          1, // chainId
          "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
        ]
      )
    );

    const messageHash = keccak256(
      ethers.utils.solidityPack(
        ["bytes1", "bytes1", "bytes32", "bytes32"],
        [
          "0x19",
          "0x01",
          domainSeparator,
          keccak256(
            ethers.utils.defaultAbiCoder.encode(
              [
                "bytes32",
                "address",
                "address",
                "uint256",
                "uint256",
                "uint256",
              ],
              [
                keccak256(
                  ethers.utils.toUtf8Bytes(
                    "Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)"
                  )
                ),
                signer.address,
                liquidityDeploy.address,
                value,
                nonce,
                deadline,
              ]
            )
          ),
        ]
      )
    );
    const signature = signer.signDigest(messageHash);
    const { v, r, s } = ethers.utils.splitSignature(signature);
    await liquidityDeploy
      .connect(signer)
      .removeLiquidityWithPermit(DAI, WETH, true, v, r, s);
  });
});
