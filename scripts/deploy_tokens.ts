import config from '../config'
import { ethers, run } from 'hardhat'

const {
	FNL_NAME,
	FNL_SYMBOL,

	HNR_NAME,
	HNR_SYMBOL,
} = config


async function main() {
	const [
		TokenFNL,
		TokenHNR
	] = await Promise.all([
		ethers.getContractFactory("TokenFNL"),
		ethers.getContractFactory("TokenHNR")
	])
	console.log('start deploy FNL')
	const fnl = await TokenFNL.deploy(
		FNL_NAME,
		FNL_SYMBOL
	)
	console.log(`FNL token has been deployed to: ${fnl.address}`);
	console.log('start deploy HNR')
	const hnr = await TokenHNR.deploy(
		HNR_NAME,
		HNR_SYMBOL
	)
	console.log(`HNR token has been deployed to: ${hnr.address}`);

	await fnl.deployed()
	await hnr.deployed()

	// const fnl = TokenFNL.attach(config.rinkeby.FNL_ADDRESS)
	// const hnr = TokenHNR.attach(config.rinkeby.HNR_ADDRESS)

	console.log('starting verify TokenFNL...')
	try {
		await run('verify:verify', {
			address: fnl!.address,
			constructorArguments: [
				FNL_NAME,
				FNL_SYMBOL
			],
		});
		console.log('verify success')
	} catch (e: any) {
		console.log(e.message)
	}

	console.log('starting verify TokenHNR...')
	try {
		await run('verify:verify', {
			address: hnr!.address,
			constructorArguments: [
				HNR_NAME,
				HNR_SYMBOL
			],
			contract: "contracts/tokens/TokenHNR.sol:TokenHNR"
		});
		console.log('verify success')
	} catch (e: any) {
		console.log(e.message)
	}
}

main()
.then(() => process.exit(0))
.catch(error => {
	console.error(error);
	process.exit(1);
});
