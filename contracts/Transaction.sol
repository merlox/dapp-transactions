pragma solidity ^0.4.11;

/// @title Transaction is a contract used to maintain invoice data in the blockchain
/// as a method to check who sells what
/// @author Merunas Grincalaitis
contract Transaction {

   address owner = msg.sender;

   bytes32 public sellerName;
   bytes32 public sellerEmail;
   address public sellerWalletAddress;
   bytes public sellerCompleteAddress;

   bytes32 public buyerName;
   bytes32 public buyerEmail;
   address public buyerWalletAddress;
   bytes public buyerCompleteAddress;

   // The IPFS hash address of the invoice file
   bytes public invoiceHashAddress;

   bytes32 public itemName;
   uint public itemPrice;
   uint public itemQuantity;
   uint public timestamp;

   /// @notice Modifier to only allow owner's execution
   modifier onlyOwner() {
        if(msg.sender == owner)
        _;
    }

    /// @notice Constructor to set the initial data of the invoice set by the
    /// buyer, the one who starts the Transaction
    /// @param _buyerName The name of the buyer
    /// @param _buyerEmail The email of the buyer
    /// @param _buyerWalletAddress The wallet address of the buyer
    /// @param _buyerCompleteAddress The full physical address of that buyer
    /// @param _sellerName The name of the seller
    /// @param _sellerEmail The email of the seller
    /// @param _sellerWalletAddress The wallet address of the seller
    /// @param _sellerCompleteAddress The full physical address of that seller
    /// @param _itemName The name of the item to buy
    /// @param _itemPrice The price of that item
    /// @param _itemQuantity The quantity that you want to buy of that item
    /// @param _invoiceHashAddress The IPFS hash address of the invoice
   function Transaction(
      bytes32 _buyerName,
      bytes32 _buyerEmail,
      address _buyerWalletAddress,
      bytes _buyerCompleteAddress,
      bytes32 _sellerName,
      bytes32 _sellerEmail,
      address _sellerWalletAddress,
      bytes _sellerCompleteAddress,
      bytes32 _itemName,
      uint _itemPrice,
      uint _itemQuantity,
      bytes _invoiceHashAddress
    ){
        timestamp = block.timestamp;
        buyerName = _buyerName;
        buyerEmail = _buyerEmail;
        buyerWalletAddress = _buyerWalletAddress;
        buyerCompleteAddress = _buyerCompleteAddress;
        sellerName = _sellerName;
        sellerEmail = _sellerEmail;
        sellerWalletAddress = _sellerWalletAddress;
        sellerCompleteAddress = _sellerCompleteAddress;
        itemName = _itemName;
        itemPrice = _itemPrice;
        itemQuantity = _itemQuantity;
        invoiceHashAddress = _invoiceHashAddress;
    }

    /// @notice Kills the contract if you're the owner
   function kill() onlyOwner {
       selfdestruct(owner);
   }
}
