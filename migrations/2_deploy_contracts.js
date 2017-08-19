var TransactionsManager = artifacts.require("./TransactionsManager.sol");

module.exports = function(deployer) {
  deployer.deploy(TransactionsManager);
};
