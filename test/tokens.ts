import BigNumber from "bignumber.js";
import hre, { network, ethers } from "hardhat";
import { Bytes, Contract, Signer } from "ethers";
import { Artifact, HardhatRuntimeEnvironment } from "hardhat/types";
import { Address } from "cluster";
const Web3 = require("web3");

var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);
var expect = chai.expect;

describe("TEST - FNL Token", function () {
	let addr: any;
	let FNL: Contract;

	it("1: deploy token", async function () {
		addr = await ethers.getSigners();
		const Token = await ethers.getContractFactory("TokenFNL");
		FNL = await Token.deploy(
			"FNL Token",
			"FNL");
	});



	it("2: balanceOf FNL", async function () {
		expect(await FNL.balanceOf(addr[0].address)).to.equal(ethers.utils.parseEther("100000000"));
	});

	it("4: details FNL", async function () {
		expect(await FNL.totalSupply()).to.equal(ethers.utils.parseEther("100000000"));
		expect(await FNL.name()).to.equal('FNL Token');
		expect(await FNL.symbol()).to.equal('FNL');
	});


	it("7: transfer FNL", async function () {
		await FNL.connect(addr[0]).transfer(addr[1].address, ethers.utils.parseEther("100"));
	});

	it("8: balanceOf FNL", async function () {
		expect(await FNL.balanceOf(addr[0].address)).to.equal(ethers.utils.parseEther('99999900'));
		expect(await FNL.balanceOf(addr[1].address)).to.equal(ethers.utils.parseEther('100'));
	});

	it("9: approve FNL", async function () {
		await FNL.connect(addr[0]).approve(addr[3].address, ethers.utils.parseEther("22"));
		await FNL.connect(addr[1]).approve(addr[4].address, ethers.utils.parseEther("11"));
	});

	it("10: allowance FNL", async function () {
		expect(await FNL.allowance(addr[0].address, addr[3].address)).to.equal('22000000000000000000');
		expect(await FNL.allowance(addr[0].address, addr[2].address)).to.equal('0');
		expect(await FNL.allowance(addr[1].address, addr[4].address)).to.equal('11000000000000000000');
	});

	it("11: decreaseAllowance FNL", async function () {
		await FNL.connect(addr[0]).decreaseAllowance(addr[3].address, '17000000000000000000');
		await FNL.connect(addr[1]).decreaseAllowance(addr[4].address, '3000000000000000000');
	});

	it("12: allowance FNL", async function () {
		expect(await FNL.allowance(addr[0].address, addr[3].address)).to.equal('5000000000000000000');
		expect(await FNL.allowance(addr[0].address, addr[2].address)).to.equal('0');
		expect(await FNL.allowance(addr[1].address, addr[4].address)).to.equal('8000000000000000000');
	});

	it("13: transferFrom FNL", async function () {
		await FNL.connect(addr[3]).transferFrom(addr[0].address, addr[3].address, ethers.utils.parseEther('3'));
		await FNL.connect(addr[4]).transferFrom(addr[1].address, addr[5].address, ethers.utils.parseEther('4'));
	});

	it("14: allowance FNL", async function () {
		expect(await FNL.allowance(addr[0].address, addr[3].address)).to.equal('2000000000000000000');
		expect(await FNL.allowance(addr[0].address, addr[2].address)).to.equal('0');
		expect(await FNL.allowance(addr[1].address, addr[4].address)).to.equal('4000000000000000000');
	});

	it("15: balanceOf FNL", async function () {
		expect(await FNL.balanceOf(addr[0].address)).to.equal(ethers.utils.parseEther('99999897'));
		expect(await FNL.balanceOf(addr[1].address)).to.equal(ethers.utils.parseEther('96'));
		expect(await FNL.balanceOf(addr[2].address)).to.equal('0');
		expect(await FNL.balanceOf(addr[3].address)).to.equal(ethers.utils.parseEther('3'));
		expect(await FNL.balanceOf(addr[4].address)).to.equal(ethers.utils.parseEther('0'));
		expect(await FNL.balanceOf(addr[5].address)).to.equal(ethers.utils.parseEther('4'));
	});

	it("14: pause FNL", async function () {
		await FNL.setPause(true);
	});

	it("14: pause transfer", async function () {
		await expect( FNL.connect(addr[0]).transfer(addr[1].address, ethers.utils.parseEther("100"))).to.be.revertedWith('Only whitelisted users can transfer while token paused!');
		await FNL.connect(addr[0]).setWhiteStatus(addr[0].address,true);
		await FNL.connect(addr[0]).transfer(addr[1].address, ethers.utils.parseEther("100"));
		expect(await FNL.balanceOf(addr[0].address)).to.equal(ethers.utils.parseEther('99999797'));
		expect(await FNL.balanceOf(addr[1].address)).to.equal(ethers.utils.parseEther('196'));
	});
	it("14: pause FNL", async function () {
		await FNL.setPause(false);

		await FNL.connect(addr[1]).transfer(addr[0].address, ethers.utils.parseEther("100"));
		expect(await FNL.balanceOf(addr[0].address)).to.equal(ethers.utils.parseEther('99999897'));
		expect(await FNL.balanceOf(addr[1].address)).to.equal(ethers.utils.parseEther('96'));
	});






});