// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const {LEASE_VERIFIER_ADDRESS, BUY_CONTRACT_ADDRESS } = require('@lease/config');

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  const accounts = await hre.ethers.getSigners();
  const owner = accounts[0].address;
  console.log("Deployer address:", owner);
  // We get the contract to deploy
  const Lease = await hre.ethers.getContractFactory("Lease");
  const lease = await Lease.deploy(LEASE_VERIFIER_ADDRESS, BUY_CONTRACT_ADDRESS);

  await lease.deployed();

  console.log("Lease deployed to:", lease.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
