const SmartContract = artifacts.require("PorkiNFTSpace");

module.exports = function (deployer) {
  deployer.deploy(SmartContract, "Porki NFT Space", "PORKI", "https://gateway.pinata.cloud/ipfs/QmQr94sQ51HdgYvXqrXEx75rBhDS4wWBWoJT1XRkhcCsmQ/", "https://gateway.pinata.cloud/ipfs/QmNaUcxWALNGQ3Bw7uVfD4FtBfmn8SKgmruHP2WfdzD22J");
};
