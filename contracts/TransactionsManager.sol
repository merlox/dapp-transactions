pragma solidity ^0.4.11;

import "./Transaction.sol";

/// @title Creates instances of Transactions and manages those active instances
/// @author Merunas Grincalaitis
contract TransactionsManager{

   // Array with the seller addresses of the transactions that are waiting seller's confirmation
   address[] pendingTransactionInstancesSellerAddress;

   // Array with the buyer addresses of the transactions that are waiting the counter sign of the buyer
   address[] waitingCounterSignInstancesBuyerAddress;

   // Array with the instance addresses of the instances that are signed and confirmed by both parties
   address[] completedTransactionInstances;

   // Array with the instance addresses of the cancelled transactions
   address[] cancelledTransactionInstances;
   address owner = msg.sender;

   // The address of the instance given a seller's address
   mapping(address => address) sellerAddressInstance;

   // The address of the instance given a buyer's address
   mapping(address => address) buyerAddressInstance;

   // The invoice hash address given the address of the seller
   mapping(address => bytes) sellerInvoiceHash;

   // Modifier for only the owner functions
   modifier onlyOwner(){
        if(msg.sender == owner)
        _;
    }

    // Fallback function to accept direct payments to the contract
    function() payable {}

    // Retuns the balance of the contract
    function getBalance() constant returns(uint){
        return this.balance;
    }

    /// @notice Generate an invoice instance for the buyer `msg.sender` and
    /// saves the instance address in the pending transactions Array
    /// @param buyerSellerAddress an address array that holds both the buyer and
    /// the seller address to keep the call stack low
    /// @param invoiceHashAddress the IPFS hash address of the generated invoice
    /// @param sellerNameEmail the name and email of the seller
    /// @param buyerVatQuantityPriceItem an array holding uint data of the buyer's
    /// vat, the quantity of units bought and the price per item
    /// @param buyerNameEmailGpsLocation array with the main data of the buyer,
    /// name, email and Gps location
    /// @param buyerCashLedger the IPFS cash ledger address of the buyer
    /// @param buyerAssetsLedger the IPFS assets ledger address of the buyer
    function generateInstance(
      address[2] buyerSellerAddress,
      bytes invoiceHashAddress,
      bytes32[2] sellerNameEmail,
      uint[3] buyerVatQuantityPriceItem,
      bytes32[3] buyerNameEmailGpsLocation,
      bytes buyerCashLedger,
      bytes buyerAssetsLedger
   ) payable{

        Transaction t = new Transaction(
            buyerSellerAddress, invoiceHashAddress, msg.value, sellerNameEmail, buyerVatQuantityPriceItem,
            buyerNameEmailGpsLocation, buyerCashLedger, buyerAssetsLedger
        );

        sellerInvoiceHash[buyerSellerAddress[1]] = invoiceHashAddress;
        pendingTransactionInstancesSellerAddress.push(buyerSellerAddress[1]);
        sellerAddressInstance[buyerSellerAddress[1]] = t;
        buyerAddressInstance[buyerSellerAddress[0]] = t;
    }

   /// @notice Updates an existing Transaction invoice smart contract with the
   /// remaining data from the seller. Gets executed when the second party, the
   /// seller confirms and add his data for the transaction
   /// @param instanceAddress the address of the instance that holds the invoice data
   /// @param sellerAddress the address of the seller
   /// @param buyerAddress the address of the buyer
   /// @param amountPaidWei the amount of ether paid for the transaction in Wei
   /// @param sellerAssetsLedgerHashAddress the IPFS hash addres of the seller's
   /// assets ledger
   /// @param sellerCashLedgerHashAddress the IPFS hash address of the seller's
   /// cash ledger
   /// @param sellerGpsLocation the location of the seller in GPS coordinates
   /// @param sellerVatNumber the VAT number of the seller
   /// @param transactionVat the VAT that will be applied to the transaction
   /// @param invoiceHash the IPFS hash address of the invoice
   /// @param envelopeId the ID of docusign used to send email esign notifications
   /// to the seller and the buyer
   function completeSellerInvoiceData(
     address instanceAddress,
     address sellerAddress,
     address buyerAddress,
     uint amountPaidWei,
     bytes sellerAssetsLedgerHashAddress,
     bytes sellerCashLedgerHashAddress,
     bytes32 sellerGpsLocation,
     uint sellerVatNumber,
     uint transactionVat,
     bytes invoiceHash,
     bytes envelopeId
    ){
        Transaction t = Transaction(instanceAddress);

        // Transfer the ether to the seller
        sellerAddress.transfer(amountPaidWei);

        t.completeSellerInvoiceData(sellerAssetsLedgerHashAddress, sellerCashLedgerHashAddress,
        sellerGpsLocation, sellerVatNumber, transactionVat, invoiceHash, envelopeId);

        // Update this transaction state by moving it to the waiting counter sign
        // instances array
        for(uint i = 0; i < pendingTransactionInstancesSellerAddress.length; i++){
            if(pendingTransactionInstancesSellerAddress[i] == sellerAddress){
                waitingCounterSignInstancesBuyerAddress.push(buyerAddress);
                pendingTransactionInstancesSellerAddress[i] = address(0);
                break;
            }
        }
   }

   /// @notice Constant function to get the IPFS invoice hash address given the
   /// seller's address
   /// @param sellerAddress the address of the seller
   function getInvoiceHash(address sellerAddress) constant returns(bytes){
       return sellerInvoiceHash[sellerAddress];
   }

   /// @notice Constant function to get the array of seller addresses with pending
   /// transactions waiting for seller confirmation and esign
   function getPendingTransactionsSellerAddresses() constant returns(address[]){
       return pendingTransactionInstancesSellerAddress;
   }

   /// @notice Constant function to get the array of buyer addresses that are
   /// waiting for the buyer's confirmation and counter-sign of the invoice
   function getWaitingCounterSignInstancesBuyerAddress() constant returns(address[]){
       return waitingCounterSignInstancesBuyerAddress;
   }

   /// @notice Returns the array of instance addresses of the completed transactions
   function getCompletedTransactionInstances() constant returns(address[]){
       return completedTransactionInstances;
   }

   /// @notice Returns the array of instance addresses of the cancelled transactions
   function getCancelledTransactionInstances() constant returns(address[]){
       return cancelledTransactionInstances;
   }

   /// @notice Returns the instance address given a seller address
   /// @param sellerAddress the address of the seller
   function getInstanceAddress(address sellerAddress) constant returns(address){
       return sellerAddressInstance[sellerAddress];
   }

   /// @notice Returns the instance address given a buyer address
   /// @param buyerAddress the address of the buyer
   function getBuyerInstanceAddress(address buyerAddress) constant returns(address){
       return buyerAddressInstance[buyerAddress];
   }

   /// @notice Returns the array of instance addresses of completed transactions
   function getCompletedTransactions() constant returns(address[]){
       return completedTransactionInstances;
   }

   /// @notice Kills an instance by updating this contract's state arrays and
   /// executing the kill function of the instance. Also stores the instance address
   /// in the cancelled transactions array
   /// @param instanceAddress the address of the instance to kill
   /// @param instanceSellerAddress the seller address of the instance to kill
   /// @param buyerAddress the address of the buyer to update the waiting counter-sign
   /// state array
   function killInstance(
      address instanceAddress,
      address instanceSellerAddress,
      address buyerAddress
   ){
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

   /// @notice Kills this contract if you're the owner of it
   function kill() onlyOwner{
       selfdestruct(owner);
   }
}
