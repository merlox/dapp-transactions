pragma solidity ^0.4.11;

import "./Transaction.sol";

/* The manager will generate instances of the Transactions like a database */
contract TransactionsManager{
   address[] pendingTransactionInstancesSellerAddress;
   address[] waitingCounterSignInstancesBuyerAddress;
   address[] completedTransactionInstances;
   address[] cancelledTransactionInstances;
   address owner = msg.sender;

   mapping(address => address) sellerAddressInstance;
   mapping(address => address) buyerAddressInstance;
   mapping(address => bytes) sellerInvoiceHash;

    modifier onlyOwner(){
        if(msg.sender == owner)
        _;
    }

    function() payable {}

    function getBalance() constant returns(uint){
        return this.balance;
    }

    function generateInstance(address[2] buyerSellerAddress, bytes invoiceHashAddress,
    bytes32[2] sellerNameEmail, uint[3] buyerVatQuantityPriceItem,
    bytes32[3] buyerNameEmailGpsLocation, bytes buyerCashLedger, bytes buyerAssetsLedger) payable{

        Transaction t = new Transaction(
            buyerSellerAddress, invoiceHashAddress, msg.value, sellerNameEmail, buyerVatQuantityPriceItem,
            buyerNameEmailGpsLocation, buyerCashLedger, buyerAssetsLedger
        );

        sellerInvoiceHash[buyerSellerAddress[1]] = invoiceHashAddress;
        pendingTransactionInstancesSellerAddress.push(buyerSellerAddress[1]);
        sellerAddressInstance[buyerSellerAddress[1]] = t;
        buyerAddressInstance[buyerSellerAddress[0]] = t;
    }

   function completeSellerInvoiceData(
        address instanceAddress, address buyerAddress, uint amountPaidWei, bytes sellerAssetsLedgerHashAddress, bytes sellerCashLedgerHashAddress,
        bytes32 sellerGpsLocation, uint sellerVatNumber, uint transactionVat, bytes invoiceHash, bytes envelopeId
    ){
        Transaction t = Transaction(instanceAddress);

        address sellerAddress = address(t.sellerAddress);

        // Transfer the ether to the seller
        sellerAddress.transfer(amountPaidWei);

        t.completeSellerInvoiceData(sellerAssetsLedgerHashAddress, sellerCashLedgerHashAddress,
        sellerGpsLocation, sellerVatNumber, transactionVat, invoiceHash, envelopeId);

        for(uint i = 0; i < pendingTransactionInstancesSellerAddress.length; i++){

            // msg.sender is the seller address that called this function
            if(pendingTransactionInstancesSellerAddress[i] == msg.sender){
                waitingCounterSignInstancesBuyerAddress.push(buyerAddress);
                pendingTransactionInstancesSellerAddress[i] = address(0);
                break;
            }
        }
   }

   function getInvoiceHash(address sellerAddress) constant returns(bytes){
       return sellerInvoiceHash[sellerAddress];
   }

   // Get the seller addresses, check if the current user's address is in there
    function getPendingTransactionsSellerAddresses() constant returns(address[]){
       return pendingTransactionInstancesSellerAddress;
   }

   function getWaitingCounterSignInstancesBuyerAddress() constant returns(address[]){
       return waitingCounterSignInstancesBuyerAddress;
   }

   function getCompletedTransactionInstances() constant returns(address[]){
       return completedTransactionInstances;
   }

   function getCancelledTransactionInstances() constant returns(address[]){
       return cancelledTransactionInstances;
   }

   // Given the seller address, get his instance smart contract address
   function getInstanceAddress(address sellerAddress) constant returns(address){
       return sellerAddressInstance[sellerAddress];
   }

   function getBuyerInstanceAddress(address buyerAddress) constant returns(address){
       return buyerAddressInstance[buyerAddress];
   }

   function getCompletedTransactions() constant returns(address[]){
       return completedTransactionInstances;
   }

   function killInstance(address instanceAddress, address instanceSellerAddress, address buyerAddress){
       Transaction t = Transaction(instanceAddress);

       sellerAddressInstance[instanceSellerAddress] = 0;
       buyerAddressInstance[buyerAddress] = 0;

       for(uint a = 0; a < pendingTransactionInstancesSellerAddress.length; a++){
           if(pendingTransactionInstancesSellerAddress[a] == instanceSellerAddress){
               pendingTransactionInstancesSellerAddress[a] = address(0);
               break;
           }
       }

       cancelledTransactionInstances.push(instanceAddress);
       t.kill();
   }

   function kill() onlyOwner{
       selfdestruct(owner);
   }
}
