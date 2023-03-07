const { assert, expect } = require("chai");
const { ethers } = require("hardhat");

describe("Testing Uniswap V2 Swap", () => {
  let WETH,
    DAI,
    weth,
    dai,
    account,
    TestSwap,
    TestSwapDeploy,
    Pair,
    pairDeploy,
    pairAddress,
    uniFacDeploy,
    uniswapFactory,
    AddressZero;

  before(async () => {
    //Initialize
    AddressZero = "0x0000000000000000000000000000000000000000";
    WETH = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";
    DAI = "0x6b175474e89094c44da98b954eedeac495271d0f";

    weth = await ethers.getContractAt("IWETH", WETH);
    account = await ethers.getSigner();
    dai = await ethers.getContractAt("IERC20", DAI);

    //Uniswap Swap contract
    TestSwap = await ethers.getContractFactory("TestUniswapSwap");
    TestSwapDeploy = await TestSwap.deploy();
    TestSwapDeploy.deployed();

    //Pair Contract
    Pair = await ethers.getContractFactory("UniswapPair");
    pairDeploy = await Pair.deploy();
    await pairDeploy.deployed();

    //Factory Contract
    uniswapFactory = await ethers.getContractFactory("TestUniswapFactory");
    uniFacDeploy = await uniswapFactory.deploy();
    await uniFacDeploy.deployed();
  });

  it("Testing transfer token function", async () => {
    const amountIn = 10n ** 18n;
    await weth.connect(account).deposit({ value: amountIn });
    await weth.connect(account).approve(TestSwapDeploy.address, amountIn);
    expect(await weth.balanceOf(account.address)).to.equals(10n ** 18n);
  });

  it("Checking the getAmountOutMin function", async () => {
    const amountIn = 10n ** 18n;
    await weth.connect(account).deposit({ value: amountIn });
    await weth.connect(account).approve(TestSwapDeploy.address, amountIn);
    const amountOutMin = await TestSwapDeploy.getAmountOutMin(
      WETH,
      DAI,
      amountIn
    );
    console.log("\nCHECKING EXPECTED PRICE");
    console.log(`Amount Of DAI Received:${amountOutMin / 1e18}`);
  });

  it("Swap Token checking the balance again", async () => {
    const amountIn = 10n ** 18n;
    await weth.connect(account).deposit({ value: amountIn });
    await weth.connect(account).approve(TestSwapDeploy.address, amountIn);
    const amountOutMin = await TestSwapDeploy.getAmountOutMin(
      WETH,
      DAI,
      amountIn
    );

    const daiAmountInAccount = await dai.balanceOf(account.address);
    await TestSwapDeploy.swap(
      WETH,
      DAI,
      amountIn,
      amountOutMin,
      account.address
    );
    expect(await dai.balanceOf(account.address)).to.equals(
      BigInt(amountOutMin) + BigInt(daiAmountInAccount)
    );
  });

  it("Get Reserve Addresses of token through Pair Address", async () => {
    const getReserveAddress = await uniFacDeploy.getReserveAdd(WETH, DAI);
    await pairDeploy.setReserve(getReserveAddress);
    const reserveInOut = await pairDeploy.getReserves();

    expect(reserveInOut.reserveIn).to.not.eq(AddressZero);
    expect(reserveInOut.reserveOut).to.not.eq(AddressZero);
  });
});
