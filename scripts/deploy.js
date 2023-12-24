const hre = require("hardhat");

async function main() {
  const ChatApp = await hre.ethers.deployContract("ChatApp");
  const chatApp = await ChatApp.waitForDeployment(); // wait for deployment and verification

  console.log(` Contract Address: ${await chatApp.getAddress()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

