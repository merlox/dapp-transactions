pragma solidity ^0.4.11;

import "./Transaction.sol";

/// @title Transaction Manager: Creates instances of Transactions and manages
/// those active instances for triple entry accounting
/// @author Merunas Grincalaitis
contract TransactionsManager{

   // Array with the seller addresses of the transactions that are waiting seller's
   // confirmation and electronic signature
   address[] pendingTransactionInstancesSellerAddress;

   // Array with the instance addresses of the instances that are signed and confirmed by both parties
   address[] completedTransactionInstances;

   // Array with the instance addresses of the instances that are cancelled
   address[] cancelledTransactionInstances;

   // Owner of the contract
   address owner = msg.sender;

   // The address of the instance given the seller's address
   mapping(address => address) sellerAddressInstance;

   // The address of the instance given the buyer's address
   mapping(address => address) buyerAddressInstance;

    // Retuns the balance of the contract
    function getBalance() constant returns(uint){
        return this.balance;
    }

   /// @notice Generates an invoice instance for the buyer `msg.sender` and
   /// saves the instance address in the pending transactions Array
   /// @param buyerName the buyer's name
   /// @param buyerEmail the buyer's email
   /// @param buyerWalletAddress the wallet address of the buyer
   /// @param buyerCompleteAddress the complete address of the buyer including
   /// @param sellerName the name of the seller
   /// @param sellerEmail the email of the seller
   /// @param sellerWalletAddress the address of the seller's wallet
   /// @param sellerCompleteAddress the complete address of the seller just like
   /// @param itemName the name of the item
   /// @param itemPrice the price in Wei of the item
   /// @param itemQuantity the quantity that you want to buy
   /// @param invoiceHashAddress the IPFS hash address of the generated invoice
   function createInstance(
      bytes32 buyerName,
      bytes32 buyerEmail,
      address buyerWalletAddress,
      bytes buyerCompleteAddress,
      bytes32 sellerName,
      bytes32 sellerEmail,
      address sellerWalletAddress,
      bytes sellerCompleteAddress,
      bytes32 itemName,
      uint itemPrice,
      uint itemQuantity,
      bytes invoiceHashAddress
   ) payable {

        Transaction t = new Transaction(
            buyerName,
            buyerEmail,
            buyerWalletAddress,
            buyerCompleteAddress,
            sellerName,
            sellerEmail,
            sellerWalletAddress,
            sellerCompleteAddress,
            itemName,
            itemPrice,
            itemQuantity,
            invoiceHashAddress
        );

        pendingTransactionInstancesSellerAddress.push(sellerWalletAddress);
        sellerAddressInstance[sellerWalletAddress] = t;
        buyerAddressInstance[buyerWalletAddress] = t;
    }

   /// @notice Constant function to get the array of seller addresses with pending
   /// transactions waiting for seller confirmation and esign
   function getPendingTransactionsSellerAddresses() constant returns(address[]){
       return pendingTransactionInstancesSellerAddress;
   }

   /// @notice Returns the array of instance addresses of the completed transactions
   function getCompletedTransactionInstances() constant returns(address[]){
       return completedTransactionInstances;
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
   /// @param sellerAddress the seller address of the instance to kill
   /// @param buyerAddress the address of the buyer to update the waiting counter-sign
   /// state array

   // TODO check that only the buyer can kill his instance and only if it's still pending
   function killInstance(
      address sellerAddress,
      address buyerAddress
   ){
      require(getInstanceAddress(sellerAddress) != 0x0);
      Transaction t = Transaction(getInstanceAddress(sellerAddress));

      sellerAddressInstance[sellerAddress] = 0x0;
      buyerAddressInstance[buyerAddress] = 0x0;
      cancelledTransactionInstances.push(t);

      t.kill();
   }
}
